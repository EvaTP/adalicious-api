
// Eléments HTML
let firstName = "";
//let clientId = null; // pour stocker l'id du client
const loginForm = document.querySelector('#login-form');
const firstNameInput = document.querySelector('#first-name');
const passwordInput = document.querySelector('#password');
const messageErreur = document.querySelector('#message-erreur');
// Pages
const welcomePage = document.querySelector('#welcome-page');
const orderMenuPage = document.querySelector('#ordermenu-page');
const orderTrackingPage = document.querySelector('#ordertracking-page');

const helloFirstNameDiv = document.querySelector('#hello-firstname');
const thanksFirstNameDiv = document.querySelector('#thanks-firstname');
const fondecran = document.querySelector('body');



// ***********************
//   WELCOME PAGE
// ***********************


// récupérer le prénom du client et passer à la page menu
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    firstName = firstNameInput.value.trim();
    password = passwordInput.value;
    if (firstName && password) {
        console.log("Connexion avec :", firstName);

        // ajout d'un cientId fixe PROVISOIRE pour tester en attente d'avoir l'authentification
        clientId = 1
        console.log("Client id : ", clientId);

		helloFirstNameDiv.innerHTML = `Bonjour <span style='color: blue;'>${firstName}</span>`;
        welcomePage.classList.add('hidden');
        orderMenuPage.classList.remove('hidden');
		messageErreur.classList.add('hidden');
        fondecran.style.backgroundColor = ('white');

        fetchMenus();
    } else {
		messageErreur.innerText = "merci de renseigner tous les champs 😉";
		messageErreur.style.color =('red');
		messageErreur.style.fontSize = ('1.5em');
    }
});


// ***********************
//   MENU & ORDER PAGE
// ***********************

// Eléments HTML
const menuListDiv = document.querySelector('#menu');

// AFFICHER LE MENU
async function fetchMenus() {
    try {
        const response = await fetch('http://localhost:3000/dishes');
        const menus = await response.json();
        console.log("le menu est", menus.dishes)
// enlever localhost et faire une variable d'environnement
    // Vide l'ancien menu s'il existe
       menuListDiv.innerHTML = "";

        menus.dishes.forEach((option) => {
            console.log("option", option)
            const optionMenu = document.createElement("div");
            //optionMenu.id = option.id;
            optionMenu.classList.add("styleOptionMenu", "optionMenu");

            // Ajout emoji
            const imagePlat = document.createElement("p");
            imagePlat.classList.add("imageMenu");
            imagePlat.innerText = option.emoji || "🍽️";
            optionMenu.appendChild(imagePlat);

            // Nom du plat
            const nomPlat = document.createElement("h3");
            nomPlat.innerText = option.name;
            nomPlat.classList.add("nomPlat");
            optionMenu.appendChild(nomPlat);

            // Prix du plat
            const prixPlat = document.createElement("p");
            prixPlat.innerText = `${option.price}€`;
            prixPlat.classList.add("prixPlat");
            optionMenu.appendChild(prixPlat);

            // Bouton commander
            const orderButton = document.createElement("button");
            orderButton.innerText = "Commander";
            orderButton.classList.add("submit-order");
            orderButton.addEventListener('click', async () => {
                try {
                    const response = await fetch('http://localhost:3000/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            client_id: clientId,
                            dish_id: option.id,
                            emoji: option.emoji || "🍽️",
                            quantity: 1,
                            unit_price: option.price
                        })
                    });

                    const result = await response.json();
                    if (response.ok) {
                        welcomePage.classList.add('hidden');
                        orderMenuPage.classList.add('hidden');
                        orderTrackingPage.classList.remove('hidden');
                        thanksFirstNameDiv.innerHTML = `Merci pour ta commande <span style='color: blue;'>${firstName}</span>`;

                        // Affichage de la commande confirmée
                        const affichageCommande = `<div class="commande-confirmation">${option.emoji || "🍽️"} ${option.name}</div>`;
                        orderTracking.innerHTML = `
                            Ta commande : <br>${affichageCommande}
                            <br>est <span class="statut">en préparation</span>
                            `;
                        console.log("Commande enregistrée :", result);

                    } else {
                        // Afficher l'erreur dans menuListDiv
                        menuListDiv.innerHTML =
                        `<div style="color: red; text-align: center; padding: 20px;">
                        <h3>Erreur lors de la commande</h3>
                        <p>${result.error || "Erreur inconnue"}</p>
                        </div>`;
                    }

                } catch (error) {
                    console.error("Erreur réseau :", error);
                        // Afficher l'erreur réseau dans menuListDiv
                        menuListDiv.innerHTML =
                        `<div style="color: red; text-align: center; padding: 20px;">
                            <h3>Erreur de connexion</h3>
                            <p>Impossible d'envoyer la commande. Vérifiez votre connexion.</p>
                        </div>`;
                }
            });
            optionMenu.appendChild(orderButton);
            menuListDiv.appendChild(optionMenu);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du menu :", error);
        menuListDiv.innerHTML =
        `<div style="color: red; text-align: center; padding: 20px;">
            <h3>Menu indisponible</h3>
            <p>Erreur lors du chargement du menu</p>
        </div>`;
    }
}


// ************************
//   ORDER TRACKING PAGE
// ************************

// Eléments HTML
const orderTracking = document.querySelector('#order-tracking');

async function afficherMesCommandes() {
    try {
        const response = await fetch(`http://localhost:3000/orders`);
        const commandes = await response.json();

        if (response.ok && commandes.length > 0) {
            // Filtrer les commandes du client
            const mesCommandes = commandes.filter(c => c.client_id === clientId);
            
            if (mesCommandes.length > 0) {
                const commandesHTML = mesCommandes.map(commande => `
                    <div class="commande-item">
                        <p><strong>Commande #${commande.id}</strong></p>
                        <p>Quantité : ${commande.quantity}</p>
                        <p>Prix : ${commande.unit_price}€</p>
                        <p>Commandé le : ${new Date(commande.created_at).toLocaleString()}</p>
                        <hr>
                    </div>
                `).join("");
                
                orderTracking.innerHTML = `<h3>Tes commandes :</h3>${commandesHTML}`;
            } else {
                orderTracking.innerHTML = "<p>Aucune commande trouvée 😊</p>";
            }
        } else {
            orderTracking.innerHTML = "<p>Aucune commande trouvée 😊</p>";
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        orderTracking.innerHTML = "<p>Erreur lors du chargement des commandes</p>";
    }
}







