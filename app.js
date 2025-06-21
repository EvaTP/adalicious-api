require("dotenv").config();
const express = require ('express');
const app = express();
const path = require ('path');
const cors = require("cors");
// const pool = require("./db");

// Middleware pour parser le JSON dans le body des requêtes POST
app.use(express.json());
app.use(cors());

const dishesRoute = require('./routes/dishes');
const ordersRoute = require('./routes/orders');
const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');

app.use('/dishes', dishesRoute);
// ( = dans toutes mes routes dishes je veux que ça commence par api/dishes)
app.use('/orders', ordersRoute);
app.use('/users', usersRoute);
app.use('/login', loginRoute);



// Middleware pour permettre à Express de servir les fichiers statiques du dossier public
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
