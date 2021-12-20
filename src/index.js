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
  done(null, { username: payload.username });
}));

passport.use(new GithubStrategy({
  clientID: Config.GITHUB_CLIENT_ID,
  clientSecret: Config.GITHUB_CLIENT_SECRET,
  callbackURL: Config.GITHUB_CALLBACK_URL
}, (token, tokenSecret, profile, done) => {
  // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
  done(null, profile);
}));

app.get('/secret',passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const { user } = req;
  res.json({ message: 'Secret Data', ...user });
});

app.get('/token', (req, res) => {
  // TODO dummy!
  const payload = { username: 'test1234' };

  const token = jwt.sign(payload, Config.APP_SECRET);
  res.json({ token });
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  console.log('/auth/github/callback');
  res.json({ message: 'auth github', ...req.user });
});

server.listen(Config.SERVER_PORT, () =>
  console.log(`Server listening at ${Config.SERVER_PORT}`));