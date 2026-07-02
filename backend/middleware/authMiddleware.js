const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { shouldUseLocalStore } = require("../utils/runtimeMode");
const localStore = require("../utils/localStore");

async function protect(req, res, next) {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (minus password) to the request so every route
      // handler after this one knows who's making the request.
      req.user = shouldUseLocalStore()
        ? localStore.publicUser(await localStore.findUserById(decoded.id))
        : await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      return next(); // all good - hand off to the actual route handler
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
}

module.exports = protect;
