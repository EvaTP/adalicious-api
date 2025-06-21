const express = require('express');
const router = express.Router();
const pool = require('../db');

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const { Decimal } = Prisma;

router.get("/test", (req, res) => {
  console.log("✅ Route /api/orders/test atteinte");
  res.send("Test route orders OK");
});

// GET : afficher toutes les commandes
router.get("/", async (req, res) => {
  const allorders = await prisma.orders.findMany();
  // console.log("all orders reçu :", allorders);

  res.json({ allorders });
});


// GET : by ID
router.get("/id/:id", async (req, res) => {
  const dbid = Number(req.params.id);
  console.log("ID reçu :", dbid);
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id: dbid,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    res.json(order);
  } catch (error) {
    
    console.error("Erreur de recherche :", error);
    res
      .status(500)
      .json({ "paramètres reçus :": params,  error: "Erreur serveur" });
  }
});


// POST /orders
// Créer une commande
router.post("/", async (req, res) => {
  const { client_id, dish_id, quantity } = req.body;
  try {
    // Récupérer le prix du plat dans la table dishes
    const dish = await prisma.dishes.findUnique({
      where: { id: dish_id }
    });
    if (!dish) {
      return res.status(404).json({ error: "Plat non trouvé" });
    }
    // Créer la commande
    const result = await prisma.orders.create({
      data: {
        client_id,
        dish_id,
        quantity,
        unit_price: dish.price,
      },
    });
    
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    res.status(500).json({ error: "Impossible de créer la commande." });
  }
});


// UPDATE
// PATCH /orders/:id
router.patch("/:id", async (req, res) => {
  const patchOrder = parseInt(req.params.id);
  console.log(patchOrder);
  const { client_id, dish_id, quantity, unit_price } = req.body;
  console.log("patch reçu :", patchOrder)
  try {
    const updatedOrder = await prisma.orders.update({
      where: { id: patchOrder },
        data: {
        client_id,
        dish_id,
        quantity,
        unit_price
      },
    });
    res.json(updatedOrder);
  } catch (error) {
    console.log(error);
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ error: "Impossible de mettre à jour cette commande." });
  }
});


// DELETE
router.delete("/:id", async (req, res) => {
  const deleteOrder = parseInt(req.params.id);
  console.log("delete :", deleteOrder);
  try {
    const deleted = await prisma.orders.delete({
      where: { id: deleteOrder },
    });
    res.json(deleted);
  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ error: "Suppression impossible" });
  }
});



// router.post('/', async (req, res) => {
// 	console.log('Route api/orders bien appellée');
//   const { customerName, dishes } = req.body;

//   if (!customerName || !Array.isArray(dishes) || dishes.length === 0) {
//     return res.status(400).json({ error: 'Données invalides' });
//   }

//   try {
//     // Commencer une transaction
//     await pool.query('BEGIN');

//     // 1. Chercher ou insérer le client (si le prénom existe déjà on le retrouve via SELECT, sinon on l'insère avec INSERT INTO)
//     let customerResult = await pool.query(
//       'SELECT id FROM customers WHERE firstname = $1',
//       [customerName]
//     );

//     let customerId;

//     if (customerResult.rows.length === 0) {
// 		// insérer le client si pas trouvé dans la base
//       const insertCustomer = await pool.query(
//         'INSERT INTO customers (firstname) VALUES ($1) RETURNING id',
//         [customerName]
//       );
//       customerId = insertCustomer.rows[0].id;
//     } else {
//       customerId = customerResult.rows[0].id;
//     }

//     // 2. Calcul du prix total
//     const totalPrice = dishes.reduce((sum, dish) => {
//       return sum + dish.unit_price * dish.quantity;
//     }, 0);

//     // 3. Insérer dans global_orders
//     const orderResult = await pool.query(
//       `INSERT INTO global_orders (client_id, total_price, created_at, status)
//        VALUES ($1, $2, NOW(), 'en préparation') RETURNING id`,
//       [customerId, totalPrice]
//     );

//     const orderId = orderResult.rows[0].id;

//     // 4. Insérer chaque plat dans orders
//     for (const dish of dishes) {
//       await pool.query(
//         `INSERT INTO orders (order_id, dish_id, quantity, unit_price)
//          VALUES ($1, $2, $3, $4)`,
//         [orderId, dish.id, dish.quantity, dish.unit_price]
//       );
//     }

//     await pool.query('COMMIT');
//     res.status(201).json({ message: 'Commande enregistrée avec succès', orderId });

//   } catch (err) {
//     await pool.query('ROLLBACK');
//     console.error('Erreur lors de la commande :', err);
//     res.status(500).json({ error: 'Erreur serveur', details: err.message });
//   }
// });

module.exports = router;



// router.post('/', (req, res) => {
//     const { client, plat, emoji, statut } = req.body;

//     if (!client || !plat) {
//         return res.status(400).json({ error: "Client et plat sont requis." });
//     }

//     const nouvelleCommande = { client, plat, emoji, statut };
//     commandes.push(nouvelleCommande);

//     res.status(201).json({
//         message: "✔️ Commande enregistrée !",
//         commande: nouvelleCommande,
//     });
// });


