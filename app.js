require("dotenv").config();
const express = require ('express');
const app = express();
const path = require ('path');

// const pool = require("./db");

const dishesRoute = require('./routes/dishes');

app.use('/api/dishes', dishesRoute);

// Middleware pour servir les fichiers statiques dans le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Exemple de route API simple
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Bienvenue sur Adalicious API 🎉' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
