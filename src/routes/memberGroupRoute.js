const express = require("express");
const router = express.Router();

// On importe les méthodes de useController
const memberGroupController = require("../controllers/memberGroupController");
const jwtMiddleWare = require("../middlewares/jwtMiddleware");
// On importe le middleware checkMember
const checkMemberMiddleware = require("../middlewares/checkMemberMiddleware");

/**
 * @openapi
 * /groups/{group_id}/allmembers-in-room:
 *   get:
 *     summary: Affiche tous les membres d'un groupe dans une salle
 *     description: Permet à un utilisateur authentifié et membre d'un groupe de secret-santa de voir les autres membres présents dans la même salle
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du groupe auquel l'utilisateur appartient
 *     responses:
 *       200:
 *         description: Liste des membres dans la salle renvoyée avec succès
 *       401:
 *         description: Authentification échouée ou token invalide ou expiré
 *       404:
 *         description: Le groupe ou la salle n'existe pas
 *     tags:
 *      - Members
 */
// On affiche tous les membres appartenant à un groupe
router.get(
  "/:group_id/allmembers-in-room",
  jwtMiddleWare.verifyToken,
  memberGroupController.displayAllMembersRoom
);

/**
 * @openapi
 * /groups/{group_id}/invitation:
 *   post:
 *     summary: Ajoute un nouveau membre à un groupe
 *     description: Permet à un utilisateur authentifié et administrateur d'un groupe d'ajouter un autre utilisateur au groupe de secret-santa
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du groupe auquel ajouter un membre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_id:
 *                 type: string
 *                 default: "60a7c8f9f1a8c9a3a4f5b6c7"
 *     responses:
 *       201:
 *         description: Membre ajouté avec succès
 *       401:
 *         description: Authentification échouée ou ajout du membre échoué
 *       403:
 *         description: Vous n'êtes pas autorisé à ajouter un membre à ce groupe
 *       404:
 *         description: Groupe ou membre introuvable
 *     tags:
 *      - Members
 */
// On invite de nouveaux membres
router.post(
  "/:group_id/invitation",
  jwtMiddleWare.verifyToken,
  //on vérifie si l'user n'exste pas déjà
  checkMemberMiddleware.checkMember,
  memberGroupController.sendInvitation
);

/**
 * @openapi
 * /groups/{group_id}/invitation-accepted:
 *   post:
 *     summary: Accepte une invitation à un groupe
 *     description: Permet à un utilisateur authentifié et invité à un groupe de secret-santa d'accepter l'invitation
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du groupe auquel l'utilisateur a été invité
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 default: "60a7c8f9f1a8c9a3a4f5b6c7"
 *               token:
 *                 type: string
 *                 default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncm91cF9pZCI6IjYwYTdjOGY5ZjFhOGM5YTNhNGY1YjZjNyIsInVzZXJfaWQiOiI2MGE3YzhmOWYxYThjOWEzYTRmNWI2YzciLCJpYXQiOjE2MjE3MjE0MzEsImV4cCI6MTYyMTg4MTQzMX0.4kxq0n0L3o0Xr0a0QZtQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQ"
 *     responses:
 *       200:
 *         description: Invitation acceptée avec succès
 *       400:
 *         description: L'invitation n'existe pas ou a déjà été traitée
 *       401:
 *         description: Authentification échouée ou token invalide ou expiré
 *     tags:
 *      - Members
 */
// Acceptation de l'invitation
router.post(
  "/:group_id/invitation-accepted",
  checkMemberMiddleware.checkMember,
  memberGroupController.acceptInvitation
);

/**
 * @openapi
 * /groups/{group_id}/invitation-refused:
 *   post:
 *     summary: Refuse une invitation à un groupe
 *     description: Permet à un utilisateur authentifié et invité à un groupe de secret-santa de refuser l'invitation
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du groupe auquel l'utilisateur a été invité
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 default: "60a7c8f9f1a8c9a3a4f5b6c7"
 *               token:
 *                 type: string
 *                 default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncm91cF9pZCI6IjYwYTdjOGY5ZjFhOGM5YTNhNGY1YjZjNyIsInVzZXJfaWQiOiI2MGE3YzhmOWYxYThjOWEzYTRmNWI2YzciLCJpYXQiOjE2MjE3MjE0MzEsImV4cCI6MTYyMTg4MTQzMX0.4kxq0n0L3o0Xr0a0QZtQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQZ0lQ"
 *     responses:
 *       200:
 *         description: Invitation refusée avec succès
 *       400:
 *         description: L'invitation n'existe pas ou a déjà été traitée
 *       401:
 *         description: Authentification échouée ou token invalide ou expiré
 *     tags:
 *      - Members
 */
// Refus de l'invitation
router.post(
  "/:group_id/invitation-refused",
  checkMemberMiddleware.checkMember,
  memberGroupController.refuseInvitation
);

module.exports = router;
