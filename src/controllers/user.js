const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const models = require("../models");
const User = models.user;

// load input validation
const validateRegisterForm = require("../validation/register");
const validateLoginForm = require("../validation/login");

// create user
const create = (req, res) => {
  const { errors, isValid } = validateRegisterForm(req.body);
  let {
    fullname,
    username,
    role = "staff",
    email,
    password,
    department,
  } = req.body;

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ where: { username } }).then((user) => {
    if (user.length) {
      return res.status(400).json({ username: "Username already exists!" });
    } else {
      let newUser = {
        fullname,
        username,
        role,
        email,
        password,
        department,
      };
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          User.create(newUser)
            .then((user) => {
              res.json({ user });
            })
            .catch((err) => {
              res.status(500).json({ err });
            });
        });
      });
    }
  });
};

const login = (req, res) => {
  const { errors, isValid } = validateLoginForm(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, password } = req.body;

  User.findOne({
    where: {
      username,
    },
  })
    .then((user) => {
      //check for user
      if (!user.length) {
        errors.username = "User not found!";
        return res.status(404).json(errors);
      }

      let originalPassword = user[0].dataValues.password;

      //check for password
      bcrypt
        .compare(password, originalPassword)
        .then((isMatch) => {
          if (isMatch) {
            // user matched
            console.log("matched!");
            const { id, username } = user[0].dataValues;
            const payload = { id, username }; //jwt payload
            // console.log(payload)

            jwt.sign(
              payload,
              "secret",
              {
                expiresIn: 3600,
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                  role: user[0].dataValues.role,
                  user: user[0].dataValues,
                });
              }
            );
          } else {
            errors.password = "Password not correct";
            return res.status(400).json(errors);
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(500).json({ err }));
};

// fetch all users
const findAllUsers = (req, res) => {
  return null;
};

// fetch user by userId
const findById = (req, res) => {
  const id = req.params.userId;

  User.findOne({ where: { id } })
    .then((user) => {
      if (!user.length) {
        return res.json({ msg: "user not found" });
      }
      res.json({ user });
    })
    .catch((err) => res.status(500).json({ err }));
};

// update a user's info
const update = (req, res) => {
  let { firstname, lastname, HospitalId, role, image } = req.body;
  const id = req.params.userId;

  User.update(
    {
      firstname,
      lastname,
      role,
    },
    { where: { id } }
  )
    .then((user) => res.status(200).json({ user }))
    .catch((err) => res.status(500).json({ err }));
};

// delete a user
const deleteUser = (req, res) => {
  const id = req.params.userId;

  User.destroy({ where: { id } })
    .then(() => res.status.json({ msg: "User has been deleted successfully!" }))
    .catch((err) => res.status(500).json({ msg: "Failed to delete!" }));
};

const verifyAuth = (req, res, next) => {
  const authToken = req.headers["authorization"];

  // Check if auth token exists and is correctly formatted
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      msg: "No token provided or invalid token format.",
    });
  }

  const token = authToken.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        success: false,
        msg: "Failed to authenticate token.",
        error: error.message,
      });
    }

    const { username } = decoded;

    User.findOne({ where: { username } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            success: false,
            msg: "User not found.",
          });
        } else {
          return res.json({
            success: true,
            user,
          });
        }
      })
      .catch((error) => {
        console.error("Database Error:", error);
        return res.status(500).json({
          success: false,
          msg: "An error occurred.",
          error: error.message,
        });
      });
  });
};

module.exports = {
  create,
  login,
  findAllUsers,
  findById,
  update,
  deleteUser,
  verifyAuth,
};
