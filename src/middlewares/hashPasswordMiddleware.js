const bcrypt = require("bcrypt");

// Middleware pour hacher le mot de passe avant de sauvegarder
const hashPasswordMiddleware = async function (next) {
  try {
    // On génèrer le sel pour le hachage = chaine de caractère aléatoire
    const salt = await bcrypt.genSalt(10);
    // On hache le mot de passe avec le sel
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // On remplace le mot de passe non haché par le mot de passe haché
    this.password = hashedPassword;
    // On passe à l'étape suivante
    next();
  } catch (error) {
    // En cas d'erreur, passer l'erreur à l'étape suivante
    next(error);
  }
};

module.exports = hashPasswordMiddleware;
