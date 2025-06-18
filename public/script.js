

// Eléments HTML
let firstName = "";
const submitNameButton = document.querySelector('#submit-name');
const firstNameInput = document.querySelector('#first-name');
const messageErreur = document.querySelector('#message-erreur');
// Pages
const welcomePage = document.querySelector('#welcome-page');
const orderMenuPage = document.querySelector('#ordermenu-page');
const orderTrackingPage = document.querySelector('#ordertracking-page');

const helloFirstNameDiv = document.querySelector('#hello-firstname');
const thanksFirstNameDiv = document.querySelector('#thanks-firstname');
const fondecran = document.querySelector('body');

// commandes unitaires
const selectedDishes = [];


// ***********************
//   WELCOME PAGE
// ***********************

     
// récupérer le prénom du client et passer à la page menu
submitNameButton.addEventListener('click', () => {
    firstName = firstNameInput.value.trim();
    if (firstName) {
		helloFirstNameDiv.innerHTML = `Bonjour <span style='color: blue;'>${firstName}</span>`;
        welcomePage.classList.add('hidden');
        orderMenuPage.classList.remove('hidden');
		messageErreur.classList.add('hidden');

        fetchMenus();
    } else {
		messageErreur.innerText = "merci de saisir ton prénom 😉";
		messageErreur.style.color =('red');
		messageErreur.style.fontSize = ('1.5em');
    }fondecran.style.backgroundColor = ('white');
});


// ***********************
//   MENU & ORDER PAGE
// ***********************

// Eléments HTML
const menuListDiv = document.querySelector('#menu');

const commandes = [];

// AFFICHER LE MENU
async function fetchMenus() {
    try {
        const response = await fetch('http://localhost:3000/api/dishes');
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

            // // Ajout emoji
           const imagePlat = document.createElement("p");
            imagePlat.classList.add("imageMenu");
           imagePlat.innerText = option.emoji || "🍽️";
            optionMenu.appendChild(imagePlat);

            // // Nom du plat
            const nomPlat = document.createElement("h3");
            nomPlat.innerText = option.name;
            nomPlat.classList.add("nomPlat");
            optionMenu.appendChild(nomPlat);

            // Description
            // const descriptionPlat = document.createElement("p");
            // descriptionPlat.classList.add("descriptionPlat");
            // descriptionPlat.innerText = option.description || "";
            // optionMenu.appendChild(descriptionPlat);

            // Bouton commander
            const orderButton = document.createElement("button");
            orderButton.innerText = "Commander";
            orderButton.classList.add("submit-order");
            orderButton.addEventListener('click', () => {
                const dish = {
                    id: option.id,
                    name: option.name,
                    emoji: option.emoji || "🍽️",
                    price: option.price,
                    quantity: 1
                };
                selectedDishes.push(dish);
                alert(`${dish.name} ajouté à ta commande 🍽️`);
            });
            optionMenu.appendChild(orderButton);

            menuListDiv.appendChild(optionMenu);
        });

        //Bouton global "Valider la commande"
        const validateButton = document.createElement("button");
        validateButton.id = "submit-order";
        validateButton.innerText = "Valider la commande";
        validateButton.classList.add("submit-order-global");
        validateButton.addEventListener('click', () => {
            if (selectedDishes.length === 0) {
                alert("Merci de sélectionner au moins un plat 😊");
                return;
            }

            welcomePage.classList.add('hidden');
            orderMenuPage.classList.add('hidden');
            orderTrackingPage.classList.remove('hidden');

            thanksFirstNameDiv.innerHTML = `Merci pour ta commande <span style='color: blue;'>${firstName}</span>`;

            const affichageCommandes = selectedDishes.map(plat =>
                `<div><span class="imageMenu">${plat.emoji}</span> ${plat.name}</div>`
            ).join("");

            orderTracking.innerHTML = `
                Ta commande : <br>${affichageCommandes}
                <br>est <span class="statut">en préparation</span>
            `;

            const commande = {
                client: firstName,
                plats: selectedDishes,
                statut: "en préparation"
            };
            enregistrerCommande(commande);
        });

        menuListDiv.appendChild(validateButton);

    } catch (error) {
        console.error("Erreur lors de la récupération du menu :", error);
        menuListDiv.innerText = "Menu indisponible pour le moment.";
    }
}


// ************************
//   ORDER TRACKING PAGE
// ************************

// Eléments HTML
const orderTracking = document.querySelector('#order-tracking');
const validerCommandeButton = document.querySelector('#valider-commande');

// ENREGISTRER LA COMMANDE dans localStorage
// function enregistrerCommande(commande) {
//     const commandes = JSON.parse(localStorage.getItem("commandes")) || [];
//     commandes.push(commande);
//     localStorage.setItem("commandes", JSON.stringify(commandes));
// }

validerCommandeButton.addEventListener('click', async () => {
    if (selectedDishes.length === 0) {
        alert("Tu n'as sélectionné aucun plat !");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerName: firstName,
                dishes: selectedDishes
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Commande envoyée avec succès !");
            console.log("Commande enregistrée :", result);
            // Rediriger vers la page de suivi
            orderMenuPage.classList.add('hidden');
            orderTrackingPage.classList.remove('hidden');
            thanksFirstNameDiv.innerHTML = `Merci pour ta commande <span style='color: blue;'>${firstName}</span>`;
            orderTracking.innerHTML = "Ta commande est en préparation 🍽️";
        } else {
            alert("Erreur lors de la commande : " + result.message);
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Impossible d’envoyer la commande.");
    }
});





