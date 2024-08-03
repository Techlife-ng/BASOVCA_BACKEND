import passport from "passport";
import config from "../config/config";
import { allowOnly } from "../services/routesHelper";
import {
  create,
  login,
  findAllUsers,
  findById,
  update,
  deleteUser,
  verifyToken,
} from "../controllers/user";
import { imageUpload } from "../config/multer";
import { blog } from "../controllers/blog";

module.exports = (app) => {
  // create a new user
  app.post(
    "/api/users/create",
    passport.authenticate("jwt", { session: false }),
    create
  );

  // user login
  app.post("/api/users/login", login);

  //retrieve all users
  app.get(
    "/api/users",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.admin, findAllUsers)
  );

  // retrieve user by id
  app.get(
    "/api/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.admin, findById)
  );

  // update a user with id
  app.put(
    "/api/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.user, update)
  );

  // delete a user
  app.delete(
    "/api/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.admin, deleteUser)
  );
  app.get("/verify-token", verifyToken);
  app.post("/blog", blog);
  app.post("/blog-pictures", imageUpload.single("media"), (req, res) => {
    // console.log("FILE", req.file);
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    // The file is already uploaded to Cloudinary by the time this callback is invoked
    res.json({ success: true, url: req.file.path });
  });
};
