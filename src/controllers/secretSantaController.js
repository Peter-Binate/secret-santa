// On importe le modèle Group
const Group = require("../models/groupModel");
// On importe le modèle MemberGroup
const MemberGroup = require("../models/memberGroupModel");
// On importe le modèle Santa
const Santa = require("../models/secretSantaModel");
// On importe la fonction shuffle de lodash
const { shuffle } = require("lodash");

// On crée la méthode secretSanta
exports.secretSanta = async (req, res) => {
  try {
    // On récupère l'id du groupe
    const group_id = req.params.group_id;
    // On compte le nombre de membres du groupe
    const memberCount = await Group.countDocuments({ group_id: group_id });
    // On vérifie s'il y a au moins 2 membres
    if (memberCount > 1) {
      // Si ce n'est pas le cas, on renvoie un message d'erreur
      res.status(400).json({
        message:
          "Le groupe doit avoir au moins 2 membres pour faire un secret santa",
      });
    } else {
      // Sinon, on continue le processus d'attribution aléatoire des partenaires
      // On récupère tous les membres du groupe
      const members = await MemberGroup.find({ group_id: group_id });
      // On mélange aléatoirement les membres
      const shuffledMembers = shuffle(members);
      // On crée un tableau vide pour stocker les paires de partenaires
      const pairs = [];
      // On parcourt les membres mélangés
      for (let i = 0; i < shuffledMembers.length; i++) {
        // On récupère le membre courant
        const gifter = shuffledMembers[i];
        // On récupère le membre suivant, ou le premier si on est à la fin du tableau
        const recipient = shuffledMembers[(i + 1) % shuffledMembers.length];
        // On vérifie que le membre courant n'est pas le même que le membre suivant
        if (gifter.user_id !== recipient.user_id) {
          // Si ce n'est pas le cas, on crée un objet Santa avec les ids du groupe, du donneur et du receveur
          const santa = new Santa({
            group_id: group_id,
            user_gifter: gifter.user_id,
            user_recipient: recipient.user_id,
          });
          // On ajoute l'objet Santa au tableau des paires
          pairs.push(santa);
        } else {
          // Si c'est le cas, on renvoie un message d'erreur
          res.status(400).json({
            message: "Un membre ne peut pas être son propre partenaire",
          });
          // On arrête la boucle
          break;
        }
      }
      // On crée tous les documents Santa dans la base de données
      await Santa.create(pairs);
      // On renvoie un message de succès avec les paires créées
      res.status(201).json({
        message: "Le secret santa a été réalisé avec succès",
        pairs: pairs,
      });
    }
  } catch (error) {
    // On gère les erreurs éventuelles
    res.status(500).json({
      message: "Une erreur s'est produite lors du secret santa",
      error: error.message,
    });
  }
};
