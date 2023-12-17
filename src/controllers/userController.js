const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
// Permet de vérifier le format mail
const validator = require("email-validator");

// On créé le nouvel user
exports.userRegister = async (req, res) => {
  try {
    let newUser = new User(req.body);
    let email = newUser.email; // récupérez l'email du nouvel utilisateur
    if (validator.validate(email)) {
      // vérifiez si l'email est valide
      let user = await newUser.save();
      res
        .status(201)
        .json({ message: `Nouveau utilisateur créé: ${user.email}` });
    } else {
      // sinon, renvoyez une erreur
      res.status(400).json({ message: "L'email n'est pas au bon format!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ message: "La création du nouvel utilisateur a échoué!" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    // On récupère et on vérifie l'email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      //Ici on renvoie une error de type serveur 500 pour une question de sécurité
      res.status(500).json({ message: "Votre utilisateur est introuvable" });
      return;
    }

    // On compare les mots de passe hachés
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // Si l'email et le password sont valides
    if (user.email === req.body.email && isPasswordValid) {
      const userData = {
        id: user.id,
        email: user.email,
        role: "admin",
      };
      /*
        On génère un token
        jwt Permet pleins d'options dont: définir l'algo, quand il expire*/
      const token = await jwt.sign(userData, process.env.JWT_KEY, {
        expiresIn: "10h",
      });
      // S'il n'y a pas d'error on génère le token
      res.status(200).json({
        message: "Connexion réussi! " + "Voici votre token: " + token,
      });
    } else {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur serveur: Une erreur s'est produite lors du traitement",
    });
  }
};

// Mise à jour des Users
exports.updateAUser = async (req, res) => {
  try {
    // On trouve l'utilisateur par son id
    const user = await User.findById(req.params.id_user);

    // On met à jour les champs de l'utilisateur avec les données de la requête
    user.email = req.body.email;
    user.password = req.body.password;
    user.role = req.body.role;

    // On sauvegarde l'utilisateur avec la méthode save
    // Cela déclenchera le middleware pré 'save' et la fonction hashPasswordMiddleware
    await user.save();

    // On enregistre les modifications
    res.status(200);
    res.json(user);
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json({ message: "Erreur serveur" });
  }
};

//Delete User
exports.deleteAUser = async (req, res) => {
  try {
    // On cherche l'utilisateur par son id
    const user = await User.findOne({ _id: req.params.id_user });
    if (user) {
      // On met à jour les champs du post
      await User.findByIdAndDelete(req.params.id_user);

      // Enregistrez les modifications
      res.status(200);
      res.json({ message: "Cette user vient d'être supprimé" });
    } else {
      // On envoie un message d'erreur
      res.status(404);
      res.json({ message: "Cette user est introuvable" });
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json({ message: "Erreur serveur" });
  }
};
