const jwt = require("jsonwebtoken");
require("dotenv").config();
// Permet de vérifier le format mail
const validator = require("email-validator");
// On importe le modèle memberGroup
const memberGroup = require("../models/memberGroupModel");

// On importe le modèle user
const User = require("../models/userModel"); // On importe le modèle user pour vérifier si l'utilisateur existe

// On crée la méthode displayAllMembersRoom
exports.displayAllMembersRoom = async (req, res) => {
  try {
    // On récupère l'id du groupe à partir des paramètres de la requête
    const group_id = req.params.group_id;

    // On cherche tous les membres qui appartiennent au groupe
    let all_members = await memberGroup.find({ group_id: group_id });

    // On envoie une réponse avec un statut 200 et un tableau de membres
    res.status(200).json(all_members);
  } catch (error) {
    // On gère les erreurs éventuelles
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des membres",
    });
    console.log(error);
  }
};

// Envoie une invitation à un utilisateur pour rejoindre un groupe
exports.sendInvitation = async (req, res, next) => {
  try {
    const admin_id = req.user.id;
    const user_mail = req.body.user_mail; // Récupérez le paramètre user_mail
    const group_id = req.params.group_id;

    let user_id; // Déclarez une variable pour stocker l'user_id
    let existingUser; // Déclarez une variable pour stocker l'utilisateur existant

    // On vérifie si l'email est valide
    if (validator.validate(user_mail)) {
      // On cherche l'utilisateur par son email
      existingUser = await User.findOne({ email: user_mail });
      if (existingUser) {
        // On affecte l'_id de l'utilisateur à l'user_id
        user_id = existingUser._id;
      }

      // Si l'user n'existe pas
      if (!existingUser) {
        const invitation_userData = {
          group_id: group_id,
          user_id: user_id,
        };

        // On créé un token d'invitation avec les informations du groupe et de l'utilisateur
        const invitation_token = await jwt.sign(
          invitation_userData,
          process.env.JWT_KEY,
          {
            expiresIn: process.env.JWT_EXPIRATION,
          }
        );

        // On génère un mot de passe par défaut
        const defaultPassword = Math.random().toString(36).slice(-8);

        // On enregistre le nouvelle user dans le model User
        const newUser = await User.create({
          email: user_mail,
          password: defaultPassword,
        });

        // On affecte l'_id du nouvel utilisateur à l'user_id
        user_id = newUser._id;
        await memberGroup.create({
          admin_id: admin_id,
          user_id: user_id,
          group_id: group_id,
          invitation_token: invitation_token,
        });
        res.status(201).json({
          message:
            "Cet utilisateur a été invité par mail avec succès, token: " +
            invitation_token,
        });
      }
    } else {
      // sinon, renvoyez une erreur
      res.status(400).json({
        message: "L'email n'est pas au bon format!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
};

// On crée la méthode acceptInvitation
exports.acceptInvitation = async (req, res) => {
  try {
    // On récupère le token à partir des paramètres de la requête
    const invitationToken = req.headers["authorization"];

    // On vérifie si le token n'est pas expiré
    const payload = await jwt.verify(invitationToken, process.env.JWT_KEY);

    // On récupère les données du payload
    const user_id = payload.user_id; // On déclare et initialise la variable user_id avec l'id de l'utilisateur
    const group_id = payload.group_id; // On déclare et initialise la variable group_id avec l'id du groupe

    // On cherche le membre dans la base de données
    const member = await memberGroup.findOne({
      user_id: user_id, // On utilise la variable user_id
      group_id: group_id, // On utilise la variable group_id
    });

    // On compare le token d'invitation avec celui du membre
    if (invitationToken === member.invitation_token) {
      // Si les tokens sont égaux, on cherche l'utilisateur dans la base de données
      const user = await User.findOne({ _id: user_id }); // On utilise la variable user_id

      // On vérifie si l'utilisateur existe
      if (user) {
        // On vérifie si le membre a déjà accepté l'invitation
        if (member.user_invitation_status != null) {
          // On renvoie un message d'erreur
          res
            .status(400)
            .json({ message: "Vous faites déjà partie de ce groupe" });
        } else {
          // On met à jour le membre avec la réponse à l'invitation
          await memberGroup.updateOne(
            { user_id: user_id, group_id: group_id },
            { user_invitation_status: true }
          );

          // On renvoie un message de succès
          res
            .status(200)
            .json({ message: "Bienvenue dans votre nouveau groupe" });
        }
      } else {
        // Si l'utilisateur n'existe pas, on renvoie un message d'erreur
        res.status(404).json({ message: "Cet utilisateur n'existe pas" });
      }
    } else {
      // Si les tokens sont différents, on renvoie un message d'erreur
      res.status(403).json({
        message: "Vous n'avez pas reçu d'invitation pour ce groupe",
      });
    }
  } catch (error) {
    // En cas d'erreur (token expiré ou autre), on envoie un message d'erreur
    res.status(403).json({
      message:
        "Le token d'invitation est expiré ou invalide. Veuillez demander une nouvelle invitation.",
      error: error.message, // On envoie des détails d'erreur pour le débogage
    });
  }
};

// On crée la méthode refuseInvitation
exports.refuseInvitation = async (req, res) => {
  try {
    const invitationToken = req.headers["authorization"];
    const payload = await jwt.verify(invitationToken, process.env.JWT_KEY);
    const user_id = payload.user_id;
    const group_id = payload.group_id;
    const member = await memberGroup.findOne({
      user_id: user_id,
      group_id: group_id,
    });
    if (invitationToken === member.invitation_token) {
      const user = await User.findOne({ _id: user_id });
      if (user) {
        if (member.user_invitation_status != null) {
          res
            .status(400)
            .json({ message: "Vous avez déjà répondu à cette invitation" });
        } else {
          await memberGroup.updateOne(
            { user_id: user_id, group_id: group_id },
            { user_invitation_status: false }
          );
          await memberGroup.deleteOne({ user_id: user_id, group_id: group_id });
          // On supprime l'utilisateur dans le modèle User
          await User.deleteOne({ _id: user_id });
          res.status(200).json({
            message: "Vous avez refusé l'invitation et supprimé votre compte",
          });
        }
      } else {
        res.status(404).json({ message: "Cet utilisateur n'existe pas" });
      }
    } else {
      res.status(403).json({
        message: "Vous n'avez pas reçu d'invitation pour ce groupe",
      });
    }
  } catch (error) {
    res.status(403).json({
      message:
        "Le token d'invitation est expiré ou invalide. Veuillez demander une nouvelle invitation.",
      error: error.message,
    });
  }
};
