const express = require("express");
const router = express.Router();

// On importe les méthodes de useController
const secretSantaController = require("../controllers/secretSantaController");
const jwtMiddleWare = require("../middlewares/jwtMiddleware");
const userController = require("../controllers/userController");

// On génère le secretsanta
router.get(
  "/:group_id/secret-santa",
  jwtMiddleWare.verifyToken,
  secretSantaController.secretSanta
);

// On affiche le partenaire secret qui doit donner le cadeau
router.get(
  "/:group_id/secret-santa/user_gifter/:user_id",
  secretSantaController.displayUserGifter
);

// On affiche le partenaire secret qui recevoir donner le cadeau
router.get(
  "/:group_id/secret-santa/user_recipient/:user_id",
  secretSantaController.displayUserRecipient
);

module.exports = router;
