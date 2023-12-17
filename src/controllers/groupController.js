// On importe le modèle Group
const Group = require("../models/groupModel");

// On crée la méthode getAllGroup
exports.getAllGroup = async (req, res) => {
  try {
    // On récupère tous les groupes de la base de données
    let groups = await Group.find();

    // On envoie une réponse avec un statut 200 et un tableau de groupes
    res.status(200).json(groups);
  } catch (error) {
    // On gère les erreurs éventuelles
    //console.log(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des groupes",
    });
    console.log(error);
  }
};

// On crée la méthode createGroup
exports.createGroup = async (req, res) => {
  try {
    // On récupère le nom du groupe à créer
    const groupName = req.body.name;
    // On vérifie si le nom du groupe est composé de chiffres et de lettres, et s'il ne dépasse pas 20 caractères
    const regex = /^[A-Za-z0-9]{1,20}$/; // Créez une expression régulière qui correspond à ces critères
    const isValid = regex.test(groupName); // Testez le nom du groupe avec cette expression régulière
    // Si ce n'est pas le cas, on lance une erreur
    if (!isValid) {
      res.status(401).json({
        message:
          "Le nom du groupe doit être composé de chiffres et de lettres, et ne pas dépasser 20 caractères. Veuillez en choisir un autre!",
      });
    }
    // On cherche si un groupe avec ce nom existe déjà
    const existingGroup = await Group.findOne({ name: groupName });
    // Si c'est le cas, on lance une erreur
    if (existingGroup) {
      res.status(401).json({
        message:
          "Ce nom de groupe est déjà pris. Veuillez en choisir un autre!",
      });
    }
    // Sinon, on crée un nouvel objet Group avec les données de la requête
    let newGroup = new Group({
      name: groupName,
      // On récupère l'id de l'user qui correspond au token
      admin_id: req.user.id,
    });

    // On sauvegarde le nouvel objet Group dans la base de données
    let group = await newGroup.save();

    // On envoie une réponse avec un message de succès et l'objet Group créé
    res.status(201).json({ message: `Nouveau groupe créé: ${group.name}` });
  } catch (error) {
    // On gère les erreurs éventuelles
    //console.log(error);
    res
      .status(401)
      .json({ message: "La création du nouveau groupe a échoué!" });
  }
};

// On crée la méthode updateGroup
exports.updateGroup = async (req, res) => {
  try {
    // On cherche le groupe existant par son id
    let group = await Group.findById(req.params.id_group);

    // On vérifie que le groupe existe
    if (!group) {
      // On renvoie une erreur de type client 404 pour indiquer que le groupe est introuvable
      res.status(404).json({ message: "Groupe introuvable" });
      return;
    }

    // On vérifie que l'utilisateur est l'administrateur du groupe
    if (req.user.id !== group.admin_id) {
      // On renvoie une erreur de type client 403 pour indiquer que l'utilisateur n'a pas le droit de modifier le groupe
      res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à modifier ce groupe" });
      return;
    }

    // On modifie les propriétés du groupe avec les données de la requête
    group.name = req.body.name || group.name;
    // On peut ajouter d'autres propriétés à modifier si besoin

    // On sauvegarde le groupe mis à jour dans la base de données
    group = await group.save();

    // On envoie une réponse avec un message de succès et le groupe mis à jour
    res.status(200).json({ message: `Groupe mis à jour: ${group.name}` });
  } catch (error) {
    // On gère les erreurs éventuelles
    //console.log(error);
    res.status(500).json({ message: "La mise à jour du groupe a échoué!" });
  }
};

// On crée la méthode deleteGroup
exports.deleteGroup = async (req, res) => {
  try {
    // On cherche le groupe existant par son id
    let group = await Group.findById(req.params.id_group);

    // On vérifie que le groupe existe
    if (!group) {
      // On renvoie une erreur de type client 404 pour indiquer que le groupe est introuvable
      res.status(404).json({ message: "Groupe introuvable" });
      return;
    }

    // On vérifie que l'utilisateur est l'administrateur du groupe
    if (req.user.id !== group.admin_id) {
      // On renvoie une erreur de type client 403 pour indiquer que l'utilisateur n'a pas le droit de supprimer le groupe
      res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à supprimer ce groupe" });
      return;
    }

    // On supprime le groupe de la base de données
    await Group.deleteOne({ _id: req.params.id_group });

    // On envoie une réponse avec un message de succès
    res.status(200).json({ message: `Groupe supprimé: ${group.name}` });
  } catch (error) {
    // On gère les erreurs éventuelles
    //console.log(error);
    res.status(500).json({ message: "La suppression du groupe a échoué!" });
  }
};
