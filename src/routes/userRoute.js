const express = require("express");
const router = express.Router();

// On importe les méthodes de useController
const userController = require("../controllers/userController");
const jwtMiddleWare = require("../middlewares/jwtMiddleware");

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     description: Crée un nouveau compte utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: "default-mail@secret-santa.com"
 *               password:
 *                 type: string
 *                 default: "defaultpassword"
 *               role:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       401:
 *         description: Erreur de requête
 *     tags:
 *      - Users
 */
// Inscription new User
router.route("/register").post(userController.userRegister);

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     description: Permet à un utilisateur de se connecter avec son email et son mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: "default-mail@secret-santa.com"
 *               password:
 *                 type: string
 *                 default: 'defaultpassword'
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie un token
 *       401:
 *         description: Authentification échouée
 *     tags:
 *      - Users
 */
// Connexion user
router.route("/login").post(userController.userLogin);

/**
 * @openapi
 * /users/{id_user}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     description: Permet à un utilisateur authentifié de modifier ses informations
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: "default-mail@secret-santa.com"
 *               password:
 *                 type: string
 *                 default: "defaultpassword"
 *               role:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       401:
 *         description: Authentification échouée
 *       404:
 *         description: Utilisateur introuvable
 *     tags:
 *      - Users
 */
//Update user
router.put("/:id_user", jwtMiddleWare.verifyToken, userController.updateAUser);

/**
 * @openapi
 * /users/{id_user}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     description: Permet à un utilisateur authentifié de supprimer son compte
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Authentification échouée
 *       404:
 *         description: Utilisateur introuvable
 *     tags:
 *      - Users
 */
//Delete User
router.delete(
  "/:id_user",
  jwtMiddleWare.verifyToken,
  userController.deleteAUser
);

module.exports = router;
