const User = require("../models/user");
const { hashPassword, comparePasswords } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const test = (req, res) => {
  res.json("test is working");
};

// register endpoint
const registerUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    // Check if name was entered
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }
    // Check if password is good
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    // check username
    if (!username || username.length < 6) {
      return res.json({
        error: "Username is required and should be at least 6 characters long",
      });
    }
    const exists = await User.findOne({ username });
    if (exists) {
      return res.json({
        error: "Username is taken already",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// login endpoint

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    // Check if passwords match
    const match = await comparePasswords(password, user.password);
    if (match) {
      // res.json("passwords match");
      jwt.sign(
        { username: user.username, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    }
    if (!match) {
      res.json({
        error: "Passwords do not match",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};
module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
};
