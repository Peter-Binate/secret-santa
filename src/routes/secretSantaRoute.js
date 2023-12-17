const express = require("express");
const router = express.Router();

// On importe les méthodes de useController
const secretSantaController = require("../controllers/secretSantaController");
const jwtMiddleWare = require("../middlewares/jwtMiddleware");

/**
 * @openapi
 * /groups/{group_id}/secret-santa:
 *   get:
 *     summary: Lance le tirage au sort du secret santa
 *     description: Permet à un utilisateur authentifié et administrateur d'un groupe de lancer le tirage au sort du secret santa et d'assigner un partenaire secret à chaque membre du groupe
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du groupe pour lequel lancer le secret santa
 *     responses:
 *       200:
 *         description: Tirage au sort effectué avec succès
 *       401:
 *         description: Authentification échouée ou tirage au sort échoué
 *       403:
 *         description: Vous n'êtes pas autorisé à lancer le secret santa pour ce groupe
 *       404:
 *         description: Groupe introuvable
 *     tags:
 *      - Secret Santa
 */
// On lance le tirage au sort du secret santa
router.get(
  "/:group_id/secret-santa",
  jwtMiddleWare.verifyToken,
  secretSantaController.secretSanta
);

/**
 * @openapi
 * /groups/{group_id}/secret-santa/user_gifter/{user_id}:
 *   get:
 *     summary: Affiche le partenaire secret qui doit donner le cadeau
 *     description: Permet à un utilisateur authentifié de voir le nom du partenaire secret qui doit lui offrir un cadeau dans le cadre du secret santa
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du groupe auquel appartient l'utilisateur
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de l'utilisateur qui veut voir son partenaire secret
 *     responses:
 *       200:
 *         description: Partenaire secret affiché avec succès
 *       401:
 *         description: Authentification échouée ou partenaire secret introuvable
 *       404:
 *         description: Groupe ou utilisateur introuvable
 *     tags:
 *      - Secret Santa
 */
// On affiche le partenaire secret qui doit donner le cadeau
router.get(
  "/:group_id/secret-santa/user_gifter/:user_id",
  secretSantaController.displayUserGifter
);

/**
 * @openapi
 * /groups/{group_id}/secret-santa/user_recipient/{user_id}:
 *   get:
 *     summary: Affiche le partenaire secret qui doit recevoir le cadeau
 *     description: Permet à un utilisateur authentifié de voir le nom du partenaire secret à qui il doit offrir un cadeau dans le cadre du secret santa
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du groupe auquel appartient l'utilisateur
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de l'utilisateur qui veut voir son partenaire secret
 *     responses:
 *       200:
 *         description: Partenaire secret affiché avec succès
 *       401:
 *         description: Authentification échouée ou partenaire secret introuvable
 *       404:
 *         description: Groupe ou utilisateur introuvable
 *     tags:
 *      - Secret Santa
 */
// On affiche le partenaire secret qui doit recevoir le cadeau
router.get(
  "/:group_id/secret-santa/user_recipient/:user_id",
  secretSantaController.displayUserRecipient
);

module.exports = router;
