import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';

import Config from './config';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.set('json spaces', 2);

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey   : Config.APP_SECRET
}, (payload, done) => {
  done(null, { username: payload.username });
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

server.listen(Config.SERVER_PORT, () =>
  console.log(`Server listening at ${Config.SERVER_PORT}`));