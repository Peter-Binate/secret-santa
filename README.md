# Secret-Santa

Ce projet est une application web qui permet de réaliser un secret-santa entre des utilisateurs qui appartiennent à des groupes. Un secret-santa est un jeu où chaque participant doit offrir un cadeau à une personne tirée au sort parmi les membres du groupe, sans que cette personne ne connaisse son identité. Chaque groupe possède un budget à respecter pour les cadeaux.

## Fonctionnalités

- Un utilisateur peut créer un compte avec son email et son mot de passe.
- Un utilisateur peut se connecter à son compte avec son email et son mot de passe.
- Un utilisateur peut créer un groupe et en devenir automatiquement l'administrateur.
- Un utilisateur peut inviter d'autres utilisateurs à rejoindre un groupe dont il est l'administrateur.
- Un utilisateur peut accepter ou refuser une invitation à rejoindre un groupe.
- Un utilisateur peut consulter la liste des groupes auxquels il appartient.
- Un administrateur peut supprimer un groupe qu'il a créé.
- Un administrateur peut modifier le nom d'un groupe qu'il a créé.
- Un utilisateur peut consulter le nom de la personne à qui il doit offrir un cadeau pour un groupe donné.

## Technologies utilisées

- Node.js: environnement d'exécution JavaScript côté serveur.
- Express: framework web pour Node.js qui facilite la création d'API RESTful.
- MongoDB: base de données NoSQL orientée documents qui stocke les données sous forme de collections de documents JSON.
- Mongoose: bibliothèque qui permet de définir des schémas et des modèles pour interagir avec MongoDB.
- JWT: standard ouvert qui permet de créer et de vérifier des jetons d'accès sécurisés.
- Bcrypt: bibliothèque qui permet de hasher et de comparer des mots de passe.
- Swagger: outil qui permet de documenter et de tester des API RESTful.

## Structure du projet

Le projet est organisé en plusieurs dossiers et fichiers à la racine (src):

- controllers: contient les fichiers qui définissent la logique métier de l'application, en fonction des requêtes et des réponses des utilisateurs.
  - userController.js: gère les opérations liées aux utilisateurs, telles que la création, la connexion, la modification et la suppression de comptes.
  - groupController.js: gère les opérations liées aux groupes, telles que la création, la modification, la suppression, la consultation et le tirage au sort du secret-santa.
  - memberGroupController.js: gère les opérations liées aux membres des groupes, telles que l'invitation, l'acceptation, le refus et le départ des utilisateurs.
  - secretSantaController.js: gère les opérations liées au secret-santa, telles que la consultation du destinataire du cadeau, l'indication de l'envoi et de la réception du cadeau.
- middlewares: contient les fichiers qui définissent des fonctions intermédiaires qui sont exécutées avant ou après les contrôleurs, pour effectuer des vérifications ou des traitements supplémentaires.
  - jwtMiddleware.js: vérifie la validité du jeton d'accès envoyé par l'utilisateur dans le header Authorization de la requête.
  - checkMemberMiddleware.js: vérifie si l'utilisateur est membre du groupe dont l'id est passé en paramètre de la requête.
  - hashPasswordMiddleware.js: hash le mot de passe de l'utilisateur avant de le stocker dans la base de données.
- models: contient les fichiers qui définissent les schémas et les modèles des données utilisées par l'application, en utilisant Mongoose.
  - userModel.js: définit le schéma et le modèle des utilisateurs, avec leurs propriétés (email, password, role) et leurs méthodes.
  - groupModel.js: définit le schéma et le modèle des groupes, avec leurs propriétés (name, admin_id, created_at, update_at) et leurs méthodes (addMember, removeMember, drawSecretSanta).
  - memberGroupModel.js: définit le schéma et le modèle des membres des groupes, avec leurs propriétés (admin_id, user_id, group_id, invitation_token, user_invitation_status, created_at, update_at ).
  - secretsantaModel.js: définit le schéma et le modèle des secret-santa, avec leurs propriétés (group_id, giver_id, receiver_id).
- routes: contient les fichiers qui définissent les routes de l'application, en utilisant Express.
  - userRoute.js: définit les routes liées aux utilisateurs, telles que /users/register, /users/login, /users/:id_user/edit, /users/:id_user/delete.
  - groupRoute.js: définit les routes liées aux groupes, telles que /groups/creategroup, /allgroups, /groups/:group_id, /groups/:group_id/edit, /groups/:group_id/delete.
  - memberGroupRoute.js: définit les routes liées aux membres des groupes, telles que /groups/:group_id/allmembers-in-room, /groups/:group_id/invitation, /groups/:group_id/invitation-accepted, /groups/:group_id/invitation-refused.
  - secretSantaRoute.js: définit les routes liées au secret-santa, telles que /groups/:group_id/secret-santa, /:group_id/secret-santa/user_gifter/:user_id et /:group_id/secret-santa/user_recipient/:user_id.
- Doc: contient le fichier qui configure la documentation de l'API, en utilisant Swagger.
  - swaggerConfig.js: définit les informations générales de l'API, ainsi que les spécifications de chaque route, avec les paramètres, les réponses et les exemples.

A la racine du projet, il y a les fichiers suivants:

- .env: contient les variables d'environnement utilisées par l'application, telles que le port, l'URL de la base de données, la clé secrète du JWT et la durée d'expiration du JWT.
- .env.sample: contient un exemple de fichier .env, avec les noms des variables d'environnement à renseigner.
- app.js: contient le code principal de l'application, qui initialise le serveur, se connecte à la base de données, utilise les routes et gère les erreurs.

## Installation et utilisation

Pour installer et utiliser ce projet, vous devez avoir Node.js et MongoDB installés sur votre machine. Vous devez aussi créer un fichier .env à la racine du projet, en vous basant sur le fichier .env.sample, et y renseigner les variables d'environnement nécessaires.

Ensuite, vous pouvez suivre les étapes suivantes:

- Cloner le dépôt GitHub du projet sur votre machine locale, en utilisant la commande `git clone https://github.com/Peter-Binate/secret-santa.git`.
- Se déplacer dans le dossier du projet, en utilisant la commande `cd secret-santa`.
- Installer les dépendances du projet, en utilisant la commande `npm install`.
- Lancer le serveur de développement, en utilisant la commande `npm run start`.
- Tester l'API avec un outil comme Postman ou Curl, en utilisant les routes définies dans le dossier routes.
- Consulter la documentation de l'API, en accédant à l'URL http://localhost:3000/api-docs (en local) https://secret-santa-peter-71501d2e013f.herokuapp.com/api-docs/ (en ligne) (ou le port que vous avez spécifié dans le fichier .env).

## Auteur

Ce projet a été réalisé par Peter Binate, un développeur web en 3 ème année de Bachelor développeur web à l'école MyDigitalSchool Paris.
