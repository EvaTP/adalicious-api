const express = require('express');
const router = express.Router();
const pool = require('../db');

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const { Decimal } = Prisma;

router.get("/test", (req, res) => {
  console.log("✅ Route /api/globalorders/test atteinte");
  res.send("Test route globalorders OK");
});


// GET : by ID
router.get("/id/:id", async (req, res) => {
  const dbid = Number(req.params.id);
  console.log("ID reçu :", dbid);

  try {
    const globalorder = await prisma.global_orders.findUnique({
      where: {
        id: dbid,
      },
    });

    if (!globalorder) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    res.json(globalorder);
  } catch (error) {
    
    console.error("Erreur de recherche :", error);
    res
      .status(500)
      .json({ "paramètres reçus :": params,  error: "Erreur serveur" });
  }
});




module.exports = router;
