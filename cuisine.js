// 🧠 Étapes du code :
// Cibler la div où afficher les commandes
// Créer la fonction afficherCommandes()
// Ajouter les addEventListener dans la boucle
// Appeler la fonction une fois au chargement


// Eléments HTML
// ciblage de la div où vont s'afficher les commandes
const ongoingOrdersDiv = document.querySelector('#kitchen-orders');
const numberOfOrders = document.querySelector('#nbr-orders');


// Fonction d'AFFICHAGE DES COMMANDES
function afficherCommandes() {
    // Vider le contenu existant
    ongoingOrdersDiv.innerHTML = "";

    // Recharger les commandes depuis le localStorage
    const commandes = JSON.parse(localStorage.getItem("commandes")) || [];

    commandes.forEach((commande, index) => {
        const commandeDiv = document.createElement("div");
        commandeDiv.classList.add("commande-item");

        commandeDiv.innerHTML = `
            <p class="imageMenuKitchen">${commande.emoji}</p>
            <p>Commande de : ${commande.client}</p>
            <p><strong>${commande.plat}</strong></p>
            <p>Statut : <span class="statut">${commande.statut}</p>
            <button class="btn-statut" id="ongoing" data-index="${index}" data-newstatut="en préparation">En préparation</button>
            <button class="btn-statut" id="ready" data-index="${index}" data-newstatut="prêt">Prêt !</button>
            <button class="btn-statut" id="cancelled" data-index="${index}" data-newstatut="annulée">Annuler</button>
        `;

        // Ajouter au DOM
        ongoingOrdersDiv.appendChild(commandeDiv);

        // Ajouter les event listeners aux boutons
        const boutons = commandeDiv.querySelectorAll(".btn-statut");
        boutons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const index = btn.dataset.index;
                const newStatut = btn.dataset.newstatut;

                const commandes = JSON.parse(localStorage.getItem("commandes")) || [];

                if (newStatut === "prêt" || newStatut === "annulée") {
                    // Supprimer la commande du tableau
                    commandes.splice(index, 1);
                } else {
                    // Mettre à jour le statut
                    commandes[index].statut = newStatut;
                }
                // Réenregistrer et réafficher
                localStorage.setItem("commandes", JSON.stringify(commandes));
                afficherCommandes();
            });
        });
    });
	// Appel de la fonction pour mettre à jour le compteur
	showQuantity();
}

// Lancer l’affichage des commandes au chargement de la page
afficherCommandes();

// afficher le nombre de commandes en cours
function showQuantity() {
    const commandes = JSON.parse(localStorage.getItem("commandes")) || [];
    numberOfOrders.textContent = commandes.length > 0
        ? `Nombre de commandes en cours : ${commandes.length}`
        : "Aucune commande en cours 👨‍🍳";
}



// Fonction d'affichage des commandes
// function afficherCommandes() {
//     // Vider le contenu existant
//     ongoingOrdersDiv.innerHTML = "";

// // Récupérer les commandes depuis le localStorage
// const commandes = JSON.parse(localStorage.getItem("commandes")) || [];

// // Boucler sur chaque commande et l'afficher
// commandes.forEach((commande, index) => {
//     const commandeDiv = document.createElement("div");
//     commandeDiv.classList.add("commande-item");

//     commandeDiv.innerHTML = `
//         <p class="imageMenuKitchen">${commande.emoji}</p>
// 		<p><strong>Commande de :</strong> ${commande.client}</p>
//         <p>${commande.plat}</p>
//         <p><strong>Statut :</strong> <span class="statut">${commande.statut}</span></p>
// 		<button class="btn-statut" id="ongoing" data-index="${index}" data-newstatut="en préparation">En préparation</button>
//         <button class="btn-statut" id="ready" data-index="${index}" data-newstatut="prêt">Prêt !</button>
//         <button class="btn-statut" id="cancelled" data-index="${index}" data-newstatut="annulée">Annuler la commande</button>
//     `;
// 	// ajouter au DOM
//     ongoingOrdersDiv.appendChild(commandeDiv);
// });

// // Ajouter les event listeners aux boutons
// const boutons = commandeDiv.querySelectorAll(".btn-statut");
// boutons.forEach((btn) => {
// 	btn.addEventListener("click", () => {
// 		const index = btn.dataset.index;
// 		const newStatut = btn.dataset.newstatut;

// 		const commandes = JSON.parse(localStorage.getItem("commandes")) || [];

// 		if (newStatut === "prêt" || newStatut === "annulée") {
// 			// Supprimer la commande du tableau
// 			commandes.splice(index, 1);
// 		} else {
// 			// Mettre à jour le statut
// 			commandes[index].statut = newStatut;
// 		}

// Gestion du clic sur les boutons
