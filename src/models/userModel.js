const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hashPasswordMiddleware = require("../middlewares/hashPasswordMiddleware");

let userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Boolean,
  },
});

// On utilise le middleware avant de sauvegarder un nouvel utilisateur
userSchema.pre("save", hashPasswordMiddleware);

module.exports = mongoose.model("User", userSchema);
