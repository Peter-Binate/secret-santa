// On créé un .env qui va stocker un nombre aléatoire
const jwt = require("jsonwebtoken");
require("dotenv").config();

// on vérifie ce qu'il y a dans le header de la requete
exports.verifyToken = async (req, res, next) => {
  try {
    // on récupère le token
    const token = req.headers["authorization"];

    // puis on vérifie que le token n'est pas undefined (qu'il est valide)
    if (token !== undefined) {
      const payload = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
          // payload =  contenu du token
          if (error) {
            //si le token n'est pas reconnu on affiche une erreur
            reject(error);
          } else {
            resolve(decoded);
          }
        });
      });
      // On récupère la data user via le token
      const user = (req.user = payload); // payload =  contenu du token

      // si le token est reconnu on passe à la suite du code
      next();
    } else {
      res
        .status(403)
        .json({ message: "Seuls les admins ont accès à cette page!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(403)
      .json({ message: "Seuls les admins ont accès à cette page!" });
  }
};
