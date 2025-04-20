
--- Table dishes
CREATE TABLE dishes(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL
);

--- Table clients
CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

--- Table order_dishes (plusieurs plats commandés)
CREATE TABLE order_dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INT,
    dish_id INT,
    quantity INT NOT NULL,
    unit_price REAL NOT NULL, -- Prix unitaire du plat au moment de la commande
    FOREIGN KEY (order_id) REFERENCES global_orders(id),
    FOREIGN KEY (dish_id) REFERENCES dishes(id)
);

--- Table globalorders
CREATE TABLE global_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INT,
	total_price REAL, -- Optionnel : pour stocker le montant total de la commande
    created_at DATETIME,
    status TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

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



INSERT INTO clients (name)
VALUES
	('Mary'),
	('Johnny'),
	('Lucie'),
	('Pierre');


INSERT INTO global_orders (client_id, total_price, created_at, status)
VALUES
(1, 3.5, DATETIME('now'), 'en attente'),
(2, 4.5, DATETIME('now'), 'en attente'),
(3, 10, '2025-04-06 12:00:00', 'annulé'),
(4, 8, '2025-04-06 13:30:00', 'prêt');


INSERT INTO order_dishes (order_id, dish_id, quantity, unit_price)
VALUES
(1, 2, 1, 3.5),  -- (Mary, 404 Not Found Fries, quantité : 1)
(2, 4, 2, 9),  -- (Johnny, Git Pull Tacos, quantité : 2)
(3, 7, 1, 10),  -- (Lucie, Full Stack Menu, quantité : 1)
(4, 1, 2, 16);  -- (Pierre, Hello World Burguer, quantité : 2)


