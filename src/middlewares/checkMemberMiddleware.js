// On importe le modèle memberGroup
const memberGroup = require("../models/memberGroupModel");

// On crée le middleware checkMember
exports.checkMember = async (req, res, next) => {
  try {
    // On récupère les données de la requête
    const user_id = req.body.user_id;
    const group_id = req.params.group_id;

    // On vérifie si l'utilisateur est déjà membre du groupe
    const existingMember = await memberGroup.findOne({
      user_id: user_id,
      group_id: group_id,
    });

    // Si l'utilisateur est déjà membre, on renvoie un message d'erreur
    if (existingMember) {
      res
        .status(400)
        .json({ message: "L'user est déjà un membre de ce groupe" });
    } else {
      // Sinon, on passe à la suite du code
      next();
    }
  } catch (error) {
    // On gère les erreurs éventuelles
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
};
