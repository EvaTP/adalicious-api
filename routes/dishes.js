const express = require('express');
const router = express.Router();
const pool = require('../db');
//router.use(express.json()); // nécessaire pour les POST car on solicite le body JSON

router.get('/test', (req, res) => {
  res.json({message : 'Route test dishes OK'});
});

// GET : TOUS LES PLATS DU MENU
router.get('/', async (req, res)=>{
  try{
    const result = await pool.query('SELECT * FROM dishes');
    res.json(result.rows);
  }catch (err){
    console.error("Erreur PostgreSQL : ", err);
    res.status(500).send("Erreur lors de la récupération du menu");
  };
});



module.exports = router;

