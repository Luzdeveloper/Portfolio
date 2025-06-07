const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  github: String,
  website: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
