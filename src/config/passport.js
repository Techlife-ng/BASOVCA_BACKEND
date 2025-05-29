"use strict";

const { Strategy, ExtractJwt } = require("passport-jwt");
const models = require("../models");
const dotenv = require("dotenv");

dotenv.config();
const Users = models.user;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

module.exports = (passport) => {
  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
      Users.findOne({ where: { id: jwt_payload.id } })
        .then((user) => {
          if (user) {
            // console.log(user.dataValues);
            return done(null, user.dataValues);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
