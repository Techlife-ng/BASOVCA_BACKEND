const passport = require("passport");
// const config = require("../config/config");
// const { allowOnly } = require("../services/routesHelper");
const {
  create,
  login,
  findAllUsers,
  findById,
  update,
  deleteUser,
  verifyUserToken,
} = require("../controllers/user");

module.exports = (app) => {
  // create a new user
  app.post("/users/create", create);

  // user login
  app.post("/users/login", login);

  //retrieve all users
  app.get(
    "/users_all",
    // passport.authenticate("jwt", {
    //   session: false,
    // }),
    findAllUsers
  );

  // retrieve user by id
  app.get(
    "/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    findById
  );

  // update a user with id
  app.put(
    "/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    update
  );

  // delete a user
  app.delete(
    "/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    deleteUser
  );
  app.get(
    "/verify-token",
    passport.authenticate("jwt", {
      session: false,
    }),
    verifyUserToken
  );
};
