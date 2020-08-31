import {v4 as uuidv4} from 'uuid'
import cookie from 'cookie'
import {
  IDENA_SESSION_TOKEN_COOKIE,
  SESSION_COOKIE_TIME,
} from '../../../shared/utils/constants'

export default (_, res) => {
  const token = uuidv4()
  const cookieAdd = cookie.serialize(IDENA_SESSION_TOKEN_COOKIE, token, {
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_COOKIE_TIME,
    httpOnly: true,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookieAdd)

  return res.json({token})
}
