const passport = require("passport");
const config = require("../config/config");
const { allowOnly } = require("../services/routesHelper");
const {
  create,
  login,
  findAllUsers,
  findById,
  update,
  deleteUser,
} = require("../controllers/user");

module.exports = (app) => {
  // create a new user
  app.post(
    "/users/create",
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.admin, create)
  );

  // user login
  app.post("/users/login", login);

  //retrieve all users
  app.get(
    "/users",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.admin, findAllUsers)
  );

  // retrieve user by id
  app.get(
    "/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.admin, findById)
  );

  // update a user with id
  app.put(
    "/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.user, update)
  );

  // delete a user
  app.delete(
    "/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.admin, deleteUser)
  );
};
