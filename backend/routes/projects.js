const express = require("express");
const Project = require("../models/Project");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Obtenir tous les projets (public)
router.get("/", async (req, res) => {
  const projects = await Project.find().sort({ date: -1 });
  res.json(projects);
});

// Ajouter un projet (admin seulement)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, github, website } = req.body;
    const project = new Project({ title, description, github, website });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer un projet (admin seulement)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, github, website } = req.body;
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, github, website },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Projet non trouvé" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
