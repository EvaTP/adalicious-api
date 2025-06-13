const express = require ('express');
const app = express();
const path = require ('path');

const menuRoutes = require('./routes/menu');

app.use('/api/menu', menuRoutes);

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
