const express = require("express");
const router = express.Router();

// On importe les méthodes de useController
const groupController = require("../controllers/groupController");
const jwtMiddleWare = require("../middlewares/jwtMiddleware");

/**
 * @openapi
 * /groups/creategroup:
 *   post:
 *     summary: Crée un nouveau groupe
 *     description: Permet à un utilisateur authentifié de créer un groupe de secret-santa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: "Mon groupe"
 *     responses:
 *       201:
 *         description: Groupe créé avec succès
 *       401:
 *         description: Authentification échouée ou création du groupe échouée
 *     tags:
 *      - Groups
 */
// Création new group
router.post(
  "/creategroup",
  jwtMiddleWare.verifyToken,
  groupController.createGroup
);

/**
 * @openapi
 * /groups/allgroups:
 *   get:
 *     summary: Affiche tous les groupes
 *     description: Permet à un utilisateur authentifié et administrateur de voir tous les groupes de secret-santa
 *     responses:
 *       200:
 *         description: Renvoie un tableau de groupes
 *       401:
 *         description: Authentification échouée
 *       403:
 *         description: Vous n'êtes pas autorisé à voir tous les groupes
 *     tags:
 *      - Groups
 */
router.get(
  "/allgroups",
  jwtMiddleWare.verifyToken,
  groupController.getAllGroup
);

/**
 * @openapi
 * /groups/{id_group}:
 *   put:
 *     summary: Met à jour un groupe
 *     description: Permet à un utilisateur authentifié et administrateur d'un groupe de modifier les informations du groupe
 *     parameters:
 *       - in: path
 *         name: id_group
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du groupe à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: "Mon groupe"
 *     responses:
 *       200:
 *         description: Groupe mis à jour avec succès
 *       401:
 *         description: Authentification échouée
 *       403:
 *         description: Vous n'êtes pas autorisé à modifier ce groupe
 *       404:
 *         description: Groupe introuvable
 *     tags:
 *      - Groups
 */
router.put(
  "/:id_group",
  jwtMiddleWare.verifyToken,
  groupController.updateGroup
);

/**
 * @openapi
 * /groups/{id_group}:
 *   delete:
 *     summary: Supprime un groupe
 *     description: Permet à un utilisateur authentifié et administrateur d'un groupe de supprimer le groupe
 *     parameters:
 *       - in: path
 *         name: id_group
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du groupe à supprimer
 *     responses:
 *       200:
 *         description: Groupe supprimé avec succès
 *       401:
 *         description: Authentification échouée
 *       403:
 *         description: Vous n'êtes pas autorisé à supprimer ce groupe
 *       404:
 *         description: Groupe introuvable
 *     tags:
 *      - Groups
 */
router.delete(
  "/:id_group",
  jwtMiddleWare.verifyToken,
  groupController.deleteGroup
);

module.exports = router;
