const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// Création de compte admin
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    res.status(201).json({ message: "Admin créé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Connexion admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Bonjour admin ! Votre ID : ${req.user.id}` });
});

module.exports = router;
