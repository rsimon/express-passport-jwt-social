import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import passport from 'passport';

// Passport auth strategies
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GithubStrategy } from 'passport-github';

import Config from './config';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.set('json spaces', 2);

passport.serializeUser((user, done) =>
  done(null, user));

passport.deserializeUser((obj, done) =>
  done(null, obj));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey   : Config.APP_SECRET
}, (payload, done) => {
  done(null, payload);
}));

passport.use(new GithubStrategy({
  clientID: Config.GITHUB_CLIENT_ID,
  clientSecret: Config.GITHUB_CLIENT_SECRET,
  callbackURL: Config.GITHUB_CALLBACK_URL
}, (token, tokenSecret, profile, done) => {
  const user = {
    userId: profile.id,
    username: profile.username,
    url: profile.profileUrl,
    displayName: profile.displayName,
    provider: profile.provider
  }

  done(null, user);
}));

// Forwards to Github OAuth login
app.get('/auth/github', passport.authenticate('github'));

// Callback from Github: token will be issued on success
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  const { user } = req;
  const token = jwt.sign(user, Config.APP_SECRET);
  res.json({ token });
});

// Test route - echos the user object if request has a valid token
app.get('/secret',passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const { user } = req;
  res.json(user);
});

server.listen(Config.SERVER_PORT, () =>
  console.log(`Server listening at ${Config.SERVER_PORT}`));