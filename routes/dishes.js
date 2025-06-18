const express = require("express");
const router = express.Router();
const pool = require("../db");

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const { Decimal } = Prisma;

// const { PrismaClient } = require("../generated/prisma");
// const { Decimal } = require("@prisma/client/runtime/library");
//const { PrismaClient } = require(@prisma); enlever output   = "../generated/prisma"

// use `prisma` in your application to read and write data in your DB

// route TEST
router.get("/test", (req, res) => {
  console.log("✅ Route /api/dishes/test atteinte");
  res.send("Test OK");
});

// GET : afficher tous les plats
router.get("/", async (req, res) => {
  const dishes = await prisma.dishes.findMany();
  // console.log(dishes);

  res.json({ dishes });
});

// GET : by name
router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const dish = await prisma.dishes.findFirst({
      where: {
        name: name,
      },
    });

    if (!dish) {
      return res.status(404).json({ error: "Plat non trouvé" });
    }

    res.json(dish);
  } catch (error) {
    console.error("Erreur de recherche :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

//exemple recherche par name :
// GET http://localhost:3000/api/dishes/name/Prisma donut
// http://localhost:3000/api/dishes/name/React Pizza

// GET By unique identifier by ID
// router.get("/:id", async (req, res) => {
//   const dishId = await prisma.dishes.findUnique({
//     where: {
//       id: 2,
//     },
//   });
//   res.json(dish);
// });

router.get("/id/:id", async (req, res) => {
  const dbid = Number(req.params.id);
  console.log("ID reçu :", dbid);

  try {
    const dish = await prisma.dishes.findUnique({
      where: {
        id: dbid,
      },
    });

    if (!dish) {
      return res.status(404).json({ error: "Plat non trouvé" });
    }
    res.json(dish);
  } catch (error) {
    
    console.error("Erreur de recherche :", error);
    res
      .status(500)
      .json({ "paramètres reçus :": params,  error: "Erreur serveur" });
  }
});
// exemple recherche par id :
// http://localhost:3000/api/dishes/id/3

router.get("/price/:price", async (req, res) => {
  const dishprice = parseFloat(req.params.price);
  console.log("price reçu :", dishprice);

  try {
    const dishesArray = await prisma.dishes.findMany({
      where: {
        price: dishprice,
      },
    });

    if (dishesArray.length === 0) {
      return res.status(404).json({ error: "Aucun plat trouvé à ce prix" });
    }

    res.json(dishesArray);
  } catch (error) {
    console.error("Erreur de recherche :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// parseFloat : dishprice est un string et c'est un INT dans le tableau il faut donc faire parseFloat/ exemple catch

// CREATE
router.post("/", async (req, res) => {
  const { name, price, emoji } = req.body;

  try {
    const result = await prisma.dishes.create({
      data: {
        name,
        price,
        emoji,
      },
    });
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la création du plat :", error);
    res.status(500).json({ error: "Impossible de créer le plat." });
  }
});

// UPDATE
// PATCH /dishes/:id
router.patch("/:id", async (req, res) => {
  const patchdish = parseInt(req.params.id);
  console.log(patchdish);
  const { name, price, emoji } = req.body;
  console.log("patch reçu :", patchdish, name, price, emoji)

  try {
    const updatedDish = await prisma.dishes.update({
      where: { id: patchdish },
        data: {
          name: name ?? undefined,
          price: price !== undefined ? parseFloat(price) : undefined,
          emoji: emoji ?? undefined,
        }
      // data: {
      //   ...(name && { name }),
      //   ...(price && { price }),
      //   ...(emoji && { emoji }),
      // },
    });
    res.json(updatedDish);
  } catch (error) {
    console.log(error);

    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ error: "Impossible de mettre à jour ce plat." });
  }
});


// DELETE
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await prisma.dishes.delete({
      where: { id },
    });
    res.json(deleted);
  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ error: "Suppression impossible" });
  }
});

// router.delete("/:id", async (req, res) => {
//   const dishDel = await prisma.dishes.delete({
//     where: {
//       id: dishDel,
//     },
//   });
//   res.json(dishDel);
// });

// app.delete("/post/:id", async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.delete({
//     where: {
//       id: Number(id),
//     },
//   })
//   res.json(post)
// })

// GET : TOUS LES PLATS DU MENU
// router.get('/', async (req, res)=>{
//    console.log("Route GET /api/dishes appelée");
//   try{
//     const result = await pool.query('SELECT * FROM dishes');
//     res.json(result.rows);
//   }catch (err){
//     console.error("Erreur PostgreSQL : ", err);
//     res.status(500).send("Erreur lors de la récupération du menu");
//   };
// });

module.exports = router;
