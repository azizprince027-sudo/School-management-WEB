// Donnees fictives de l'utilisateur connecte.
// Reste a faire : recuperer ces informations depuis la reponse de /auth/login
// plutot que de les coder en dur ici.
const identite = {
    role: "admin",
    libelle: "Administrateur",
    nom: "Admin",
};

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("etiquette-role").textContent = identite.role;
    document.getElementById("role-utilisateur").textContent = identite.libelle;
    document.getElementById("nom-utilisateur").textContent = identite.nom;
    document.getElementById("avatar-utilisateur").textContent =
        identite.nom.charAt(0);
});

function afficherVue(idVue, bouton) {
    document.querySelectorAll(".vue").forEach((v) => v.classList.remove("actif"));
    document.getElementById(idVue).classList.add("actif");
    bouton.parentElement
        .querySelectorAll(".element-menu")
        .forEach((b) => b.classList.remove("actif"));
    bouton.classList.add("actif");
    document.getElementById("barre-laterale").classList.remove("ouvert");
}

function deconnecter() {
    window.location.href = "index.html";
}