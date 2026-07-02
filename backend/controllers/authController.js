const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { shouldUseLocalStore } = require("../utils/runtimeMode");
const localStore = require("../utils/localStore");

async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = shouldUseLocalStore()
      ? await localStore.createUser({ name, email, password })
      : await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err); // let the central error handler format the response
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = shouldUseLocalStore()
      ? await localStore.findUserByEmail(email)
      : await User.findOne({ email }).select("+password");

    const passwordMatches = shouldUseLocalStore()
      ? await localStore.verifyUserPassword(user, password)
      : user && (await user.matchPassword(password));

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res) {
  res.json(req.user); // req.user was set by the protect middleware
}

module.exports = { registerUser, loginUser, getMe };
