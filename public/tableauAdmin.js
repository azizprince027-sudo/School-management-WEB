// Navigation entre les vues du tableau de bord 
const boutonsMenu = document.querySelectorAll('.element-menu');
const vues = document.querySelectorAll('.vue');

boutonsMenu.forEach(bouton => {
    bouton.addEventListener('click', () => {
        const cibleId = bouton.dataset.vue; // ex: "admin-etudiants"

        // Retire "actif" de tous les boutons et vues, puis l'ajoute seulement à celui cliqué
        boutonsMenu.forEach(b => b.classList.remove('actif'));
        vues.forEach(v => v.classList.remove('actif'));

        bouton.classList.add('actif');
        document.getElementById(cibleId).classList.add('actif');
    });
});
async function chargerEtudiants() {
    try {
        const reponse = await fetch('/students');

        if (!reponse.ok) {
            console.error('Erreur lors du chargement des etudiants :', reponse.status);
            return;
        }

        const etudiants = await reponse.json(); // tableau d'objets { id, matricule, nom, prenom, age, classe }

        const corpsTableau = document.getElementById('corps-etudiants');
        corpsTableau.innerHTML = ''; // on vide les lignes statiques existantes

        etudiants.forEach(etudiant => {
            const ligne = document.createElement('tr');
            ligne.innerHTML = `
                <td class="matricule">${etudiant.matricule}</td>
                <td class="cellule-nom"><b>${etudiant.nom} ${etudiant.prenom}</b></td>
                <td>${etudiant.age}</td>
                <td>${etudiant.classe}</td>
                <td class="actions-ligne">
                    <button class="bouton-discret">✎</button>
                    <button class="bouton-discret">🗑</button>
                </td>
            `;
            corpsTableau.appendChild(ligne);
        });

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

chargerEtudiants();