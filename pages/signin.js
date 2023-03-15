import {useEffect, useState} from 'react'
import {useQuery} from 'react-query'
import Layout from '../shared/components/layout'
import {getAuthToken, getCurrentSession} from '../shared/api'
import {useSession} from '../shared/utils/session-context'

const LOADING = 'loading'
const FAILED = 'failed'
const SUCCESS = 'success'

function Signin({baseUrl, callbackUrl, attempt}) {
  const [state, setState] = useState(LOADING)
  const {setSession} = useSession()

  const generateDnaUrl = (token, baseUrl, callbackUrl) => {
    const callback = new URL(callbackUrl, baseUrl)
    const startSession = new URL('/api/auth/session', baseUrl)
    const authenticate = new URL('/api/auth/authenticate', baseUrl)

    const dnaUrl = `https://idena-web-git-try-fix-safari-window-open-idena.vercel.app/dna/signin/v1?callback_url=${encodeURIComponent(
      callback.href
    )}&token=${token}&nonce_endpoint=${encodeURIComponent(
      startSession.href
    )}&authentication_endpoint=${encodeURIComponent(authenticate.href)}`
    return dnaUrl
  }

  const {data: tokenResult} = useQuery([`auth/token${attempt}`], getAuthToken)

  const {data: sessionResult} = useQuery(
    state !== FAILED && ['auth/session', tokenResult],
    () => getCurrentSession(true),
    {retry: true, retryDelay: 1000}
  )

  useEffect(() => {
    if (tokenResult && !(sessionResult && sessionResult.authenticated)) {
      const url = generateDnaUrl(tokenResult.token, baseUrl, callbackUrl)
      // eslint-disable-next-line no-restricted-globals
      // location.href = url
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenResult])

  useEffect(() => {
    let timeout
    if (state === LOADING) {
      timeout = setTimeout(() => {
        if (state !== SUCCESS) setState(FAILED)
      }, 15000)
    }
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenResult])

  useEffect(() => {
    if (sessionResult && sessionResult.authenticated) {
      setSession(sessionResult.address)
      setState(SUCCESS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionResult])

  const cl = () => {
    alert(
      `X:${new URL(callbackUrl, baseUrl)}, Y: ${
        new URL(callbackUrl, baseUrl).href
      }, Z: ${encodeURIComponent(
        new URL(callbackUrl, baseUrl).href
      )}, dd: ${generateDnaUrl('token', baseUrl, callbackUrl)}`
    )
  }

  return (
    <Layout title="Sign-in with Idena app" signinLoading={state === LOADING}>
      <div className="container">
        <div className="card" style={{textAlign: 'center', height: '70vh'}}>
          <button onClick={cl}>asdasd</button>
          <div>
            <img
              alt="icon"
              className="icon-logo-black"
              style={{margin: 50, maxWidth: 62}}
            />

            <div style={{display: state === LOADING ? 'block' : 'none'}}>
              <h3>Launching Idena App...</h3>
              <div className="text_block">
                If you do not have Idena app installed on your computer, please
                open <br />
                the <a href="https://idena.io?view=download">
                  download page
                </a>{' '}
                to install it and then try again
              </div>
            </div>

            <div style={{display: state === FAILED ? 'block' : 'none'}}>
              <h3>Idena Proof-of-Person Blockchain</h3>
              <div className="text_block">
                If nothing promts from browser then{' '}
                <a href="https://idena.io?view=download">
                  download and install Idena app
                </a>
              </div>
            </div>

            <div style={{display: state === SUCCESS ? 'block' : 'none'}}>
              <h3>Idena Proof-of-Person Blockchain</h3>
              <div className="text_block">Signed in successfully</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

Signin.getInitialProps = ({req, query}) => {
  let baseUrl
  if (req) {
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    baseUrl = `${protocol}://${req.headers.host}`
  } else {
    // Client side rendering
    baseUrl = `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ''
    }`
  }

  return {
    attempt: query.attempt || 0,
    baseUrl,
    callbackUrl: decodeURIComponent(query.callback_url),
  }
}

export default Signin
