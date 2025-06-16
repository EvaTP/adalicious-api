const express = require('express');
const router = express.Router();
const pool = require('../db');
//router.use(express.json()); // nécessaire pour les POST car on solicite le body JSON


const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB

router.get('/test', async (req, res) => {
  const dishes = await prisma.dishes.findMany()
  console.log(dishes);

  res.json({message : dishes});
});





// GET : TOUS LES PLATS DU MENU
router.get('/', async (req, res)=>{
   console.log("Route GET /api/dishes appelée");
  try{
    const result = await pool.query('SELECT * FROM dishes');
    res.json(result.rows);
  }catch (err){
    console.error("Erreur PostgreSQL : ", err);
    res.status(500).send("Erreur lors de la récupération du menu");
  };
});



module.exports = router;

