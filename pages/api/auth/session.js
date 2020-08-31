import {query as q} from 'faunadb'
import cookie from 'cookie'
import {v4 as uuidv4} from 'uuid'
import {
  IDENA_AUTH_COOKIE,
  IDENA_SESSION_TOKEN_COOKIE,
  AUTH_COOKIE_TIME,
  FAUNA_IDX_NAME,
  FAUNA_COLLECTION_NAME,
} from '../../../shared/utils/constants'
import {serverClient} from '../../../shared/utils/faunaAuth'

async function getSession(req, res) {
  const session = req.cookies[IDENA_AUTH_COOKIE]
  if (session) {
    return res.json({authenticated: true, address: JSON.parse(session).address})
  }

  if (req.query.onlyCheck) {
    return res.status(200).end()
  }

  const sessionToken = req.cookies[IDENA_SESSION_TOKEN_COOKIE]
  if (sessionToken) {
    const response = await serverClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index(FAUNA_IDX_NAME), sessionToken)),
        q.Lambda((x) => q.Get(x))
      )
    )
    if (response.data.length) {
      const {address, authenticated} = response.data[0].data
      if (authenticated) {
        const cookieRemove = cookie.serialize(IDENA_SESSION_TOKEN_COOKIE, '', {
          secure: process.env.NODE_ENV === 'production',
          maxAge: -1,
          httpOnly: true,
          path: '/',
        })

        const cookieAdd = cookie.serialize(
          IDENA_AUTH_COOKIE,
          JSON.stringify({authenticated: true, address}),
          {
            secure: process.env.NODE_ENV === 'production',
            maxAge: AUTH_COOKIE_TIME,
            httpOnly: true,
            path: '/',
          }
        )

        res.setHeader('Set-Cookie', [cookieRemove, cookieAdd])

        return res.status(200).json({authenticated: true, address})
      }
    }
  }

  return res.status(403).end()
}

async function newSession(req, res) {
  try {
    const {token, address} = req.body
    const nonce = `signin-${uuidv4()}`
    await serverClient.query(
      q.Create(q.Collection(FAUNA_COLLECTION_NAME), {
        data: {
          token,
          address,
          nonce,
        },
      })
    )
    return res.json({success: true, data: {nonce}})
  } catch (error) {
    res.status(400).send('fail to persist session')
  }
}

export default async (req, res) => {
  if (req.method === 'GET') {
    return getSession(req, res)
  }
  return newSession(req, res)
}
