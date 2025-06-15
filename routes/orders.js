const express = require('express');
const router = express.Router();
const pool = require('../db');


// POST /api/orders
// Créer une commande
router.post('/', async (req, res) => {
	console.log('Route api/orders bien appellée');
  const { customerName, dishes } = req.body;

  if (!customerName || !Array.isArray(dishes) || dishes.length === 0) {
    return res.status(400).json({ error: 'Données invalides' });
  }

  try {
    // Commencer une transaction
    await pool.query('BEGIN');

    // 1. Chercher ou insérer le client (si le prénom existe déjà on le retrouve via SELECT, sinon on l'insère avec INSERT INTO)
    let customerResult = await pool.query(
      'SELECT id FROM customers WHERE firstname = $1',
      [customerName]
    );

    let customerId;

    if (customerResult.rows.length === 0) {
		// insérer le client si pas trouvé dans la base
      const insertCustomer = await pool.query(
        'INSERT INTO customers (firstname) VALUES ($1) RETURNING id',
        [customerName]
      );
      customerId = insertCustomer.rows[0].id;
    } else {
      customerId = customerResult.rows[0].id;
    }

    // 2. Calcul du prix total
    const totalPrice = dishes.reduce((sum, dish) => {
      return sum + dish.unit_price * dish.quantity;
    }, 0);

    // 3. Insérer dans global_orders
    const orderResult = await pool.query(
      `INSERT INTO global_orders (client_id, total_price, created_at, status)
       VALUES ($1, $2, NOW(), 'en préparation') RETURNING id`,
      [customerId, totalPrice]
    );

    const orderId = orderResult.rows[0].id;

    // 4. Insérer chaque plat dans order_dishes
    for (const dish of dishes) {
      await pool.query(
        `INSERT INTO order_dishes (order_id, dish_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, dish.id, dish.quantity, dish.unit_price]
      );
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Commande enregistrée avec succès', orderId });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Erreur lors de la commande :', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

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


