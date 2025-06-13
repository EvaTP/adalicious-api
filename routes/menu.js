const express = require('express');
const pool = require('../db');

const router = express.Router();
router.use(express.json()); // nécessaire pour les POST car on solicite le body JSON


// GET : TOUS LES PLATS DU MENU
router.get('/', async (req, res)=>{
  try{
    const result = await pool.query('SELECT * FROM menu');
    res.json(result.rows);
  }catch (err){
    console.error("Erreur PostgreSQL : ", err);
    res.status(500).send("Erreur lors de la récupération du menu");
  };
});



module.exports = router;

