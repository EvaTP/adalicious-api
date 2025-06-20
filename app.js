require("dotenv").config();
const express = require ('express');
const app = express();
const path = require ('path');

// const pool = require("./db");

// Middleware pour parser le JSON dans le body des requêtes POST
app.use(express.json());

const dishesRoute = require('./routes/dishes');
const ordersRoute = require('./routes/orders');
const globalOrdersRoute = require('./routes/globalorders');
const usersRoute = require('/routes/users');

app.use('/api/dishes', dishesRoute);
// ( = dans toutes mes routes dishes je veux que ça commence par api/dishes)
app.use('/api/orders', ordersRoute);
app.use('/api/globalorders', globalOrdersRoute);
app.use('/users', usersRoute);



// Middleware pour servir les fichiers statiques dans le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Exemple de route API simple
app.get('/hello', (req, res) => {
  res.json({ message: 'Bienvenue sur Adalicious API 🎉' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
