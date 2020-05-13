import Layout from '../shared/components/layout';
import { useEffect, useState } from 'react';
import { getAuthToken, getCurrentSession } from '../shared/api';
import { useQuery } from 'react-query';
import { useSession } from '../shared/utils/session-context';

const LOADING = 'loading',
  FAILED = 'failed',
  SUCCESS = 'success';

function Signin({ baseUrl, callbackUrl, attempt }) {
  const [state, setState] = useState(LOADING);
  const { setSession } = useSession();

  const generateDnaUrl = (token, baseUrl, callbackUrl) => {
    const callback = new URL(callbackUrl, baseUrl);
    const startSession = new URL('/auth/v1/start-session', baseUrl);
    const authenticate = new URL('/auth/v1/authenticate', baseUrl);

    const dnaUrl =
      'dna://signin/v1?callback_url=' +
      encodeURIComponent(callback.href) +
      '&token=' +
      token +
      '&nonce_endpoint=' +
      encodeURIComponent(startSession.href) +
      '&authentication_endpoint=' +
      encodeURIComponent(authenticate.href);
    return dnaUrl;
  };

  const { data: tokenResult } = useQuery(
    ['auth/token' + attempt],
    getAuthToken
  );

  const { data: sessionResult } = useQuery(
    state != FAILED && ['auth/session', tokenResult],
    () => getCurrentSession(true),
    { retry: true, retryDelay: 1000 }
  );

  useEffect(() => {
    if (tokenResult && !(sessionResult && sessionResult.authenticated)) {
      const url = generateDnaUrl(tokenResult.token, baseUrl, callbackUrl);
      location.href = url;
    }
  }, [tokenResult]);

  useEffect(() => {
    let timeout;
    if (state === LOADING) {
      timeout = setTimeout(() => {
        if (state !== SUCCESS) setState(FAILED);
      }, 15000);
    }
    return () => clearTimeout(timeout);
  }, [tokenResult]);

  useEffect(() => {
    if (sessionResult && sessionResult.authenticated) {
      setSession(sessionResult.address);
      setState(SUCCESS);
    }
  }, [sessionResult]);

  return (
    <Layout signinLoading={state === LOADING}>
      <div className="container">
        <div className="card" style={{ textAlign: 'center', height: '70vh' }}>
          <div>
            <img
              className="icon-logo-black"
              width={62}
              style={{ margin: 50 }}
            ></img>

            <div style={{ display: state === LOADING ? 'block' : 'none' }}>
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

            <div style={{ display: state === FAILED ? 'block' : 'none' }}>
              <h3>Idena Proof-of-Person Blockchain</h3>
              <div className="text_block">
                If nothing promts from browser then{' '}
                <a href="https://idena.io?view=download">
                  download and install Idena app
                </a>
              </div>
            </div>

            <div style={{ display: state === SUCCESS ? 'block' : 'none' }}>
              <h3>Idena Proof-of-Person Blockchain</h3>
              <div className="text_block">Signed in successfully</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

Signin.getInitialProps = ({ req, query }) => {
  let baseUrl;
  if (req) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    baseUrl = req.protocol + '://' + req.get('host');
    baseUrl = protocol + '://' + req.headers.host;
  } else {
    // Client side rendering
    baseUrl =
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '');
  }

  return {
    attempt: query.attempt || 0,
    baseUrl: baseUrl,
    callbackUrl: decodeURIComponent(query.callback_url),
  };
};

export default Signin;
