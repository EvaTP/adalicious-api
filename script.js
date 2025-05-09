import { menus } from "./menu.js";


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
menus.forEach((option)=>{
	const optionMenu = document.createElement("div");
    optionMenu.id = option.plate;
	optionMenu.classList.add("styleOptionMenu");

	// Ajout emoji
	const imagePlat = document.createElement("p");
	imagePlat.classList.add("imageMenu");
	imagePlat.innerText = option.image;
	optionMenu.appendChild(imagePlat);

	// Ajout nom du plat
	const nomPlat = document.createElement("h3");
	nomPlat.innerText = option.plate;
	nomPlat.classList.add("nomPlat");
	optionMenu.appendChild(nomPlat);

	// Ajout description
	const descriptionPlat = document.createElement("p");
	descriptionPlat.classList.add("descriptionPlat");
	descriptionPlat.innerText = option.description;
	optionMenu.appendChild(descriptionPlat);

	// Ajout bouton "Commander"
    const orderButton = document.createElement("button");
    orderButton.innerText = "Commander";
    orderButton.classList.add("submit-order");
	optionMenu.appendChild(orderButton);

    optionMenu.classList.add("optionMenu");
    menuListDiv.appendChild(optionMenu);
});


// ************************
//   ORDER TRACKING PAGE
// ************************


// Eléments HTML
const orderTracking = document.querySelector('#order-tracking');

// ENREGISTRER LA COMMANDE
function enregistrerCommande(commande) {
    const commandes = JSON.parse(localStorage.getItem("commandes")) || [];
    commandes.push(commande);
    localStorage.setItem("commandes", JSON.stringify(commandes));
}

menuListDiv.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('submit-order')) {
        // Navigation vers la page de suivi
        welcomePage.classList.add('hidden');
        orderMenuPage.classList.add('hidden');
        orderTrackingPage.classList.remove('hidden');

        // Récupération des infos du plat
        const bouton = event.target;
        const divPlat = bouton.closest('.optionMenu');
        const nomPlat = divPlat.id;
        const emojiPlat = divPlat.querySelector('.imageMenu').innerText;
		console.log("Plat commandé :", emojiPlat, nomPlat);

        // Affichage de la confirmation
        thanksFirstNameDiv.innerHTML = `Merci pour ta commande <span style='color: blue;'>${firstName}</span>`;
        
        // Création de l'objet "commande" et enregistrement de la commande dans le localStorage
        const commande = {
            client: firstName,
            plat: nomPlat,
            emoji: emojiPlat,
            statut: "en préparation"
        };
		// afficher la commande au client
		orderTracking.innerHTML = `Ta commande <br><span class="imageMenu">${emojiPlat}</span><br>${nomPlat} <br>est <span class="statut">${commande.statut}</span>`;

		
		// orderTracking.innerText = `Ta commande \n${emojiPlat}\n${nomPlat} \nest <span class="statut">${commande.statut}</span>`;
        // NOTE : \n ne fonctionne que avec innerText; innerHTML n'interprète pas les retours à la ligne car il s'attend à du HTML, pas du texte brut.
		// pour forcer un retour à la ligne avec innerHTML il faut utiliser la balise <br>
		enregistrerCommande(commande); // Appel à ta fonction
    }
});





