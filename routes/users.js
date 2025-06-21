const express = require("express");
const router = express.Router();
// const pool = require("../db"); n'est plus nécessaire avec prisma

// use `prisma` in your application to read and write data in your DB
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const { Decimal } = Prisma;


// route TEST
router.get("/test", (req, res) => {
  console.log("✅ Route /api/users/test atteinte");
  res.send("Test route users OK");
});

// GET : afficher tous les clients
router.get("/", async (req, res) => {
  const users = await prisma.customers.findMany();
  // console.log("Données brutes de Prisma:", users);
  // console.log("Premier user:", JSON.stringify(users[0], null, 2));
  res.json({ users });
});


// GET : by ID
router.get("/id/:id", async (req, res) => {
  const userid = Number(req.params.id);
  console.log("ID reçu :", userid);

  try {
    const user = await prisma.customers.findUnique({
      where: {
        id: userid,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "client non trouvé" });
    }
    res.json(user);
  } catch (error) {
    
    console.error("Erreur de recherche :", error);
    res
      .status(500)
      .json({ "paramètres reçus :": params,  error: "Erreur serveur" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  const { firstname, password } = req.body;
  try {
    const result = await prisma.customers.create({
      data: {
        firstname,
        password,
      },
    });
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la création du client :", error);
    res.status(500).json({ error: "Impossible de créer le client." });
  }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  const patchuser = parseInt(req.params.id);
  console.log(patchuser);
  const { firstname, password } = req.body;
  console.log("patch reçu :", patchuser, firstname, password)
  try {
    const updatedClient = await prisma.customers.update({
      where: { id: patchuser },
        data: {
          firstname: firstname,
          password: password,
        }
    });
    res.json(updatedClient);
  } catch (error) {
    console.log(error);
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ error: "Impossible de mettre à jour ce client." });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const deleteUser = parseInt(req.params.id);
  console.log("delete :", deleteUser);
  try {
    const deleted = await prisma.customers.delete({
      where: { id: deleteUser },
    });
    res.json(deleted);
  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ error: "Suppression impossible" });
  }
});



// route debub
// router.get("/debug", async (req, res) => {
//   try {
//     // Test 1: Raw query
//     const rawResult = await prisma.$queryRaw`SELECT * FROM customers LIMIT 3`;
//     console.log("Raw query:", rawResult);
    
//     // Test 2: Prisma findMany
//     const prismaResult = await prisma.customers.findMany({
//       take: 3
//     });
//     console.log("Prisma findMany:", prismaResult);
    
//     // Test 3: Select explicite
//     const selectResult = await prisma.customers.findMany({
//       select: {
//         id: true,
//         firstname: true,
//         password: true
//       },
//       take: 3
//     });
//     console.log("Select explicite:", selectResult);
    
//     res.json({
//       raw: rawResult,
//       prisma: prismaResult,
//       select: selectResult
//     });
//   } catch (error) {
//     console.error("Erreur:", error);
//     res.status(500).json({ error: error.message });
//   }
// });





module.exports = router;