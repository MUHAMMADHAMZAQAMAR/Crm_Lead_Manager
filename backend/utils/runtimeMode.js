const mongoose = require("mongoose");

let localModeEnabled = false;

function enableLocalMode() {
  localModeEnabled = true;
}

function isLocalMode() {
  return localModeEnabled;
}

function shouldUseLocalStore() {
  return localModeEnabled || mongoose.connection.readyState !== 1;
}

module.exports = { enableLocalMode, isLocalMode, shouldUseLocalStore };