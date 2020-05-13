const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid');
const { checkSignature } = require('./ether');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const sessionCache = new NodeCache({
  stdTTL: 60 * 5,
  checkperiod: 60,
});

const SESSION_COOKIE_TIME = 5 * 60 * 1000;
const AUTH_COOKIE_TIME = 24 * 60 * 60 * 1000;

const IDENA_SESSION_TOKEN_COOKIE = 'IDENA_SESSION_TOKEN';
const IDENA_AUTH_COOKIE = 'IDENA_AUTH';

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());
  server.use(bodyParser.json());

  server.get('/address', (req, res) => {
    return res.redirect(`/address/${req.query.address}`);
  });

  server.get('/reward', (req, res) => {
    return res.redirect(
      `/identity/${req.query.identity}/epoch/${req.query.epoch}/rewards`
    );
  });

  server.get('/answers', (req, res) => {
    return res.redirect(
      `/identity/${req.query.identity}/epoch/${req.query.epoch}/validation`
    );
  });

  server.get('/validation', (req, res) => {
    return res.redirect(`/epoch/${req.query.epoch}/validation`);
  });

  server.get('/rewards', (req, res) => {
    return res.redirect(`/epoch/${req.query.epoch}/rewards`);
  });

  server.get('/auth/v1/session', (req, res) => {
    const session = req.cookies[IDENA_AUTH_COOKIE];
    if (session) {
      return res.json({ authenticated: true, address: session.address });
    }

    if (req.query.onlyCheck) {
      return res.sendStatus(403);
    }

    const sessionToken = req.cookies[IDENA_SESSION_TOKEN_COOKIE];
    if (sessionToken) {
      const data = sessionCache.get(sessionToken);
      if (data) {
        const { address, authenticated } = data;
        if (authenticated) {
          res.clearCookie(IDENA_SESSION_TOKEN_COOKIE);
          res.cookie(
            IDENA_AUTH_COOKIE,
            { authenticated: true, address: address },
            {
              maxAge: AUTH_COOKIE_TIME,
              httpOnly: true,
            }
          );
          return res
            .status(200)
            .json({ authenticated: true, address: address });
        }
      }
    }

    return res.sendStatus(403);
  });

  server.post('/auth/v1/logout', (req, res) => {
    const session = req.cookies[IDENA_AUTH_COOKIE];
    if (session) {
      res.clearCookie(IDENA_AUTH_COOKIE);
      return res.json();
    }
  });

  server.get('/auth/v1/new-token', (_, res) => {
    const token = uuidv4();
    res.cookie(IDENA_SESSION_TOKEN_COOKIE, token, {
      maxAge: SESSION_COOKIE_TIME,
      httpOnly: true,
    });
    return res.json({ token });
  });

  server.post('/auth/v1/start-session', (req, res) => {
    const { token, address } = req.body;
    const nonce = `signin-${uuidv4()}`;
    sessionCache.set(token, { address, nonce });
    return res.json({ success: true, data: { nonce } });
  });

  server.post('/auth/v1/authenticate', (req, res) => {
    const { token, signature } = req.body;

    const cacheValue = sessionCache.get(token);
    if (!cacheValue) {
      return res.json({
        success: false,
        data: {
          authenticated: false,
        },
      });
    }

    const address = checkSignature(cacheValue.nonce, signature);

    if (address.toLowerCase() !== cacheValue.address.toLowerCase()) {
      return res.json({
        success: false,
        data: {
          authenticated: false,
        },
      });
    }

    sessionCache.set(token, { ...cacheValue, authenticated: true });

    return res.json({
      success: true,
      data: {
        authenticated: true,
      },
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
