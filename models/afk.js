const mongoose = require("mongoose");

module.exports = mongoose.model(
  "joinToCreate",
  new mongoose.Schema({
    User: String,
    Reason: String,
    Time: String,
    OriginalName: String,
  })
);
