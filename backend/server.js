require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", require("./routes/projects"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connecté");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Serveur lancé sur le port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ Erreur MongoDB :", err));
