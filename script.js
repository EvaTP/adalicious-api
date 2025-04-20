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
		// console.log('cacher la welcome page');
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
     // commanderButton.dataset.plate = option.plate;Stocker le nom du plat dans un attribut data
	 //orderButton.id = `commander-${option.plate}`; // ID unique pour le bouton
	 optionMenu.appendChild(orderButton);

    optionMenu.classList.add("optionMenu");
    menuListDiv.appendChild(optionMenu);
});


// ************************
//   ORDER TRACKING PAGE
// ************************

// Eléments HTML
const orderTracking = document.querySelector('#order-tracking');

// récupération du plat cliqué
menuListDiv.addEventListener('click',(event) => {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('submit-order')) {
        
		welcomePage.classList.add('hidden');
        orderMenuPage.classList.add('hidden');
		orderTrackingPage.classList.remove('hidden');
		thanksFirstNameDiv.innerHTML = `Merci pour ta commande <span style='color: blue;'>${firstName}</span>`;
		
		const bouton = event.target;
        const divPlat = bouton.closest('.optionMenu');
        const nomPlat = divPlat.id; // l'id est le nom du plat
		const emojiPlat = divPlat.querySelector('.imageMenu').innerText;
        console.log("Plat commandé :", emojiPlat, nomPlat);

		// ➕ Ajouter à la liste des commandes
        // commandes.push({ nom: nomPlat, emoji: emojiPlat });
		 // Créer une chaîne avec tous les plats commandés
		 // const recap = commandes.map(c => `${c.emoji} ${c.nom}`).join('\n');

		orderTracking.innerText = `Ta commande \n${emojiPlat}\n${nomPlat} \nest en cours`;
		// orderTracking.innerText = `Ta commande \n${recap} \nest en cours`;
    }
});
