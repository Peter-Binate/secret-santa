// On importe mongoose
const mongoose = require("mongoose");
// on acccède à toute les méthodes disponibles de mongoose que l'on stocke dans Schema
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  // Le nom du groupe
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // L'id de l'administrateur du groupe
  admin_id: {
    type: String,
    required: true,
  },
  // La date de création du groupe
  created_at: {
    type: Date,
    default: Date.now,
  },
  // La date de mise à jour du groupe
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// On exporte le modèle du groupe
module.exports = mongoose.model("Group", groupSchema);
