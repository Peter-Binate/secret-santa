// On importe mongoose
const mongoose = require("mongoose");
// on acccède à toute les méthodes disponibles de mongoose que l'on stocke dans Schema
const Schema = mongoose.Schema;

let secretSantaSchema = new Schema({
  group_id: {
    type: String,
    required: true,
  },
  user_gifter: {
    type: String,
    required: true,
  },
  user_recipient: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Santa", secretSantaSchema);
