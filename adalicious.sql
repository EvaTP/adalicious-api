-- NEON PostgreSQL database

-- CREATION TABLES (respecter l'ordre de création à cause des FK)
--- Table dishes
CREATE TABLE dishes(
	id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    price NUMERIC (5,2) NOT NULL
);

--- Table clients
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL
);
-- ajout colonne password
ALTER TABLE customers ADD COLUMN password TEXT;
-- une fois les passwords ajoutés modifier la colonne en NOT NULL
ALTER TABLE "public"."customers"
ALTER COLUMN "password"
SET NOT NULL


--- Table global_orders (plusieurs plats commandés)
CREATE TABLE global_orders (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES customers(id),
	total_price REAL, -- Optionnel : pour stocker le montant total de la commande
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT -- status : "en attente", "en préparation", "prêt", "annulé"
);


--- Table order_dishes 
CREATE TABLE order_dishes (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    dish_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price REAL NOT NULL, -- Prix unitaire du plat au moment de la commande
    FOREIGN KEY (order_id) REFERENCES global_orders(id),
    FOREIGN KEY (dish_id) REFERENCES dishes(id)
);
-- Deux FOREIGN KEY bien placées pour relier les commandes globales et les plats.
-- unit_price permet de conserver l’historique du prix au moment de l’achat, ce qui est très pertinent.

-- Table status
CREATE TABLE order_status (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL
);

INSERT INTO order_status (status)
VALUES
    ('en attente'),
    ('en préparation'),
    ('prêt'),
    ('annulé');


-- Insertion données
INSERT INTO dishes (name, price)
VALUES
    ('Hello World Burguer', 8),
    ('404 Not Found Fries', 3.5),
    ('JSON Nuggets', 7),
	('Git Pull Tacos', 4.5),
    ('Front-end Salad', 5),
    ('Back-end Brownie', 3),
	('Full Stack Menu', 10),
    ('React Pizza', 4),
    ('Python Milk-shake', 2);

-- ajout de la colonne emoji (se place en dernier dans la table)
ALTER TABLE dishes ADD COLUMN emoji TEXT;

-- puis ajout des différents emojis :
UPDATE dishes SET emoji = '🍔' WHERE name = 'Hello World Burguer';
UPDATE dishes SET emoji = '🍟' WHERE name = '404 Not Found Fries';
UPDATE dishes SET emoji = '🍗' WHERE name = 'JSON Nuggets';
UPDATE dishes SET emoji = '🌮' WHERE name = 'Git Pull Tacos';
UPDATE dishes SET emoji = '🥗' WHERE name = 'Front-end Salad';
UPDATE dishes SET emoji = '🍪' WHERE name = 'Back-end Brownie';
UPDATE dishes SET emoji = '🍔🥤' WHERE name = 'Full Stack Menu';
UPDATE dishes SET emoji = '🍕' WHERE name = 'React Pizza';
UPDATE dishes SET emoji = '🥤' WHERE name = 'Python Milk-shake';


INSERT INTO dishes (name, price, emoji)
VALUES
    ('Express cola', 2, '🧋'),
    ('Java Hot dog', 5, '🌭');

-- nouveau SELECT avec les emojis en demandant les colonnes dans l'ordre voulu
-- en SQL, tu n’es pas obligé de suivre l’ordre physique des colonnes dans la table quand tu fais un SELECT.
-- Tu peux tout à fait choisir l’ordre que tu veux en listant explicitement les colonne
SELECT id, emoji, name, description, price FROM dishes;

SELECT emoji, name, price FROM dishes;

INSERT INTO customers (firstname)
VALUES
	('Mary'),
	('Johnny'),
	('Lucie'),
    ('Frances'),
    ('Pepe'),
	('Pierre');

UPDATE customers
SET password = CASE id
  WHEN 1 THEN 'azerty123'
  WHEN 2 THEN 'motdepasse456'
  WHEN 3 THEN 'secure789'
  WHEN 4 THEN 'bonjour2024'
  WHEN 5 THEN 'secretabc'
  WHEN 6 THEN 'codeXYZ'
  WHEN 7 THEN 'admin321'
  WHEN 8 THEN 'pass0008'
  ELSE password
END
WHERE id IN (1,2,3,4,5,6,7,8);



INSERT INTO global_orders (client_id, total_price, created_at, status)
VALUES
(1, 3.5, CURRENT_TIMESTAMP, 'en attente'),
(2, 4.5, CURRENT_TIMESTAMP, 'en attente'),
(3, 10, '2025-04-06 12:00:00', 'annulé'),
(4, 8, '2025-04-06 13:30:00', 'prêt'),
(5, 4, '2025-06-13 13:30:00', 'en attente');


-- Ajouter la colonne status_id
ALTER TABLE global_orders 
ADD COLUMN status_id INTEGER;

-- Ajouter la contrainte de foreign key
ALTER TABLE global_orders 
ADD CONSTRAINT fk_global_orders_status 
FOREIGN KEY (status_id) REFERENCES order_status(id);

-- migration des données de statut de la commande

UPDATE global_orders 
SET status_id = (SELECT id FROM order_status WHERE status = 'en attente')
WHERE status = 'en attente';

UPDATE global_orders 
SET status_id = (SELECT id FROM order_status WHERE status = 'en préparation')
WHERE status = 'en préparation';

UPDATE global_orders 
SET status_id = (SELECT id FROM order_status WHERE status = 'prêt')
WHERE status = 'prêt';

UPDATE global_orders 
SET status_id = (SELECT id FROM order_status WHERE status = 'annulé')
WHERE status = 'annulé';

-- après la migration on peut supprimer l'ancienne colonne status, remplacée par status_id
ALTER TABLE global_orders 
DROP COLUMN status;

-- exemple concret




INSERT INTO order_dishes (order_id, dish_id, quantity, unit_price)
VALUES
(1, 2, 1, 3.5),  -- (Mary, 404 Not Found Fries, quantité : 1)
(2, 4, 2, 9),  -- (Johnny, Git Pull Tacos, quantité : 2)
(3, 7, 1, 10),  -- (Lucie, Full Stack Menu, quantité : 1)
(4, 1, 2, 16),  -- (Frances, Hello World Burguer, quantité : 2)
(5, 5, 1, 5); -- (Pepe, Front-end salad, quantité : 1)

INSERT INTO order_dishes (order_id, dish_id, quantity, unit_price)
VALUES
(1, 2, 1, 3.5),   -- 1 plat dont l'id est 2, quantité 1, à 3.5 €
(1, 5, 2, 2.0);   -- 2 plats dont l'id est 5, à 2.0 € chacun


-- Requests : tous les plats commandés par Alice
SELECT c.firstname, d.name, od.quantity, od.unit_price
FROM customers c
JOIN global_orders go ON c.id = go.client_id
JOIN order_dishes od ON go.id = od.order_id
JOIN dishes d ON od.dish_id = d.id
WHERE c.firstname = 'Alice';


-- prénom, Id de la commande, plats, quantité, prix unitaire
-- SELECT 
--   customers.name AS customer_name,
--   global_orders.id AS order_id,
--   dishes.name AS dish_name,
--   order_dishes.quantity,
--   order_dishes.unit_price
-- FROM order_dishes
-- JOIN global_orders ON order_dishes.order_id = global_orders.id
-- JOIN customers ON global_orders.client_id = customers.id
-- JOIN dishes ON order_dishes.dish_id = dishes.id
-- ORDER BY global_orders.id;
EXPLAIN (FORMAT JSON, COSTS, BUFFERS, VERBOSE) SELECT 
  customers.firstname AS customer_name,
    global_orders.id AS order_id,
      dishes.name AS dish_name,
        order_dishes.quantity,
          order_dishes.unit_price
          FROM order_dishes
          JOIN global_orders ON order_dishes.order_id = global_orders.id
          JOIN customers ON global_orders.client_id = customers.id
          JOIN dishes ON order_dishes.dish_id = dishes.id
          ORDER BY global_orders.id



-- REFACTO TABLES
-- **************

INSERT INTO dishes (name, price, emoji)
VALUES
    ('Hello World Burger', 8, '🍔'),
    ('404 Not Found Fries', 3.5, '🍟'),
    ('JSON Nuggets', 7, '🍗'),
	('Git Pull Tacos', 4.5, '🌮'),
    ('Front-end Salad', 5, '🥗'),
    ('Back-end Brownie', 3, '🍪'),
	('Full Stack Menu', 10, '🍔🥤'),
    ('React Pizza', 4, '🍕'),
    ('Python Milk-shake', 2, '🥤'),
    ('Express cola', 2, '🧋'),
    ('Java Hot dog', 5, '🌭');


INSERT INTO customers (firstname, password)
VALUES
	('Mary','azerty123'),
	('Johnny', 'motdepasse456'),
	('Lucie','secure789'),
    ('Frances','bonjour2024'),
    ('Pepe','secretabc'),
	('Pierre','codeXYZ');





INSERT INTO orders (client_id, dish_id, quantity, unit_price, created_at)
SELECT 
  v.client_id, 
  v.dish_id, 
  v.quantity, 
  d.price,              -- ← ICI on récupère le prix !
  CURRENT_TIMESTAMP
FROM (VALUES 
  (1, 2, 1),
  (2, 4, 2),
  (3, 7, 1),
  (4, 1, 2),
  (5, 5, 1)
) AS v(client_id, dish_id, quantity)
JOIN dishes d ON d.id = v.dish_id;  -- ← ET ICI on fait la liaison !


-- (1, 2, 1) = (Mary, 404 Not Found Fries, quantité : 1)
-- (2, 4, 2) =(Johnny, Git Pull Tacos, quantité : 2)
-- (3, 7, 1) = (Lucie, Full Stack Menu, quantité : 1)
-- (4, 1, 2) = (Frances, Hello World Burger, quantité : 2)
-- (5, 5, 1) = (Pepe, Front-end salad, quantité : 1)


ALTER TABLE orders
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
