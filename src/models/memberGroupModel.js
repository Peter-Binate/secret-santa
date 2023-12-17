// On importe mongoose
const mongoose = require("mongoose");
// on acccède à toute les méthodes disponibles de mongoose que l'on stocke dans Schema
const Schema = mongoose.Schema;

const memberGroupSchema = new Schema({
  // L'id de l'administrateur du groupe
  admin_id: {
    type: String,
    required: true,
  },
  // L'id de l'administrateur des users du groupe
  user_id: {
    type: String,
    required: true,
  },
  // L'id du groupe
  group_id: {
    type: String,
    required: true,
  },
  // status de l'invitation au group
  user_invitation_status: {
    type: Boolean,
    default: null,
  },
  // token d'invitation
  invitation_token: {
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
module.exports = mongoose.model("memberGroup", memberGroupSchema);
