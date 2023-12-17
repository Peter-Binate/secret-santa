const express = require("express");
const router = express.Router();

// On importe les méthodes de useController
const secretSantaController = require("../controllers/secretSantaController");
const jwtMiddleWare = require("../middlewares/jwtMiddleware");
// On importe le middleware checkMember
const checkMemberMiddleware = require("../middlewares/checkMemberMiddleware");

// On génère le secretsanta
router.get(
  "/:group_id/secret-santa",
  jwtMiddleWare.verifyToken,
  secretSantaController.secretSanta
);

module.exports = router;
