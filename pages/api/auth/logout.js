import cookie from 'cookie'
import {IDENA_AUTH_COOKIE} from '../../../shared/utils/constants'

export default (req, res) => {
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const idenaAuthCookie = cookies[IDENA_AUTH_COOKIE]
  if (!idenaAuthCookie) {
    return res.status(200).end()
  }
  const cookieSerialized = cookie.serialize(IDENA_AUTH_COOKIE, '', {
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
    httpOnly: true,
    path: '/',
  })
  res.setHeader('Set-Cookie', cookieSerialized)
  res.status(200).end()
}
