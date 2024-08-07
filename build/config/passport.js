import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import models from "../models";
const Users = models.User;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

// create jwt strategy
module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    Users.findAll({
      where: {
        id: jwt_payload.id
      }
    }).then(user => {
      if (user.length) {
        return done(null, user[0]);
      }
      return done(null, false);
    }).catch(err => console.log(err));
  }));
};
//# sourceMappingURL=passport.js.map