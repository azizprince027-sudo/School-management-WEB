// Gestion du menu mobile
const boutonMenuMobile = document.querySelector('.bouton-menu');
const barreLaterale = document.getElementById('barre-laterale');
boutonMenuMobile.addEventListener('click', () => {
    barreLaterale.classList.toggle('ouvert');
});

// Fermer le menu si on clique en dehors
document.addEventListener('click', (event) => {
    const clicDansLaBarre = barreLaterale.contains(event.target);
    const clicSurBoutonMenu = boutonMenuMobile.contains(event.target);

    if (!clicDansLaBarre && !clicSurBoutonMenu) {
        barreLaterale.classList.remove('ouvert');
    }
});

//  Chargement des statistiques
async function chargerStatistiques() {
    try {
        const [reponseEtudiants, reponseProfs, reponseMatieres] = await Promise.all([
            fetch('/students'),
            fetch('/teachers'),
            fetch('/subjects')
        ]); //lance les 3 premières requêtes en parallèle c plus rapides que 3await

        const etudiants = await reponseEtudiants.json();
        const profs = await reponseProfs.json();
        const matieres = await reponseMatieres.json();

        document.getElementById('stat-etudiants').textContent = etudiants.length;
        document.getElementById('stat-professeurs').textContent = profs.length;
        document.getElementById('stat-matieres').textContent = matieres.length;

        const aujourdhui = new Date().toISOString().split('T')[0]; // date
        const reponseAbsences = await fetch(`/stats/absences/${aujourdhui}`);
        const dataAbsences = await reponseAbsences.json();
        document.getElementById('stat-absences-jour').textContent = dataAbsences.total;

    } catch (err) {
        console.error('Erreur reseau (statistiques) :', err);
    }
}

chargerStatistiques();

//  Affichage de la date du jour en haut a droites
function afficherDateDuJour() {
    const maintenant = new Date();
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }; // formatage de la date
    const texteDate = maintenant.toLocaleDateString('fr-FR', options); // formatage de la date
    document.getElementById('date-du-jour').textContent = texteDate; // affichage de la date
}

afficherDateDuJour();

// Navigation entre les vues du tableau de bord
const boutonsMenu = document.querySelectorAll(".element-menu");
const vues = document.querySelectorAll(".vue");

boutonsMenu.forEach((bouton) => {
    bouton.addEventListener("click", () => {
        const cibleId = bouton.dataset.vue; // les vues de chaqu tableau

        // Retire "actif" de tous les boutons et vues, puis l'ajoute seulement à celui cliqué
        boutonsMenu.forEach((b) => b.classList.remove("actif"));
        vues.forEach((v) => v.classList.remove("actif"));

        bouton.classList.add("actif");
        document.getElementById(cibleId).classList.add("actif");
    });
});

// vure des etudiant
async function chargerEtudiants() {
    try {
        const reponse = await fetch("/students");

        if (!reponse.ok) {
            console.error(
                "Erreur lors du chargement des etudiants :",
                reponse.status,
            );
            return;
        }

        const etudiants = await reponse.json(); // tableau d'objets { id, matricule, nom, prenom, age, classe }

        const corpsTableau = document.getElementById("corps-etudiants");
        corpsTableau.innerHTML = ""; // on vide les lignes statiques existantes

        etudiants.forEach((etudiant) => {
            const ligne = document.createElement("tr");
            ligne.innerHTML = `
                <td class="matricule">${etudiant.matricule}</td>
                <td class="cellule-nom"><b>${etudiant.nom} ${etudiant.prenom}</b></td>
                <td>${etudiant.age}</td>
                <td>${etudiant.classe}</td>
                <td class="actions-ligne">
                    <button class="bouton-discret" data-action="modifier" data-matricule="${etudiant.matricule}">✎</button>
                    <button class="bouton-discret" data-action="supprimer" data-matricule="${etudiant.matricule}">🗑</button>
                </td>
            `;
            corpsTableau.appendChild(ligne);
        });
    } catch (err) {
        console.error("Erreur reseau :", err);
    }
}

chargerEtudiants();

// vue des proffeseurs
async function chargerProfesseurs() {
    try {
        const reponse = await fetch("/teachers");

        if (!reponse.ok) {
            console.error(
                "Erreur lors du chargement des professeurs :",
                reponse.status,
            );
            return;
        }

        const professeurs = await reponse.json(); // { id, user_id, nom, matiere, classe }

        const corpsTableau = document.getElementById("corps-professeurs");
        corpsTableau.innerHTML = "";

        professeurs.forEach((prof) => {
            const ligne = document.createElement("tr");
            ligne.innerHTML = `
                <td class="cellule-nom"><b>${prof.nom}</b></td>
                <td>${prof.matiere}</td>
                <td>${prof.classe}</td>
                <td class="matricule">••••</td>
                <td class="actions-ligne">
                    <button class="bouton-discret" data-action="modifier" data-id="${prof.id}">✎</button>
                    <button class="bouton-discret" data-action="supprimer" data-id="${prof.id}">🗑</button>
                </td>
            `;
            corpsTableau.appendChild(ligne);
        });
    } catch (err) {
        console.error("Erreur reseau :", err);
    }
}

async function recupererListeProfesseurs() {
    try {
        const reponse = await fetch('/teachers');
        if (!reponse.ok) return [];
        return await reponse.json();
    } catch (err) {
        console.error('Erreur reseau :', err);
        return [];
    }
}

function remplirSelectProfesseurs(selectElement, professeurs, idSelectionne = null) {
    selectElement.innerHTML = '<option value="">Non affecté</option>';
    professeurs.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof.id;
        option.textContent = `${prof.nom} (${prof.matiere})`;
        if (idSelectionne && Number(idSelectionne) === prof.id) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}


chargerProfesseurs();

// vue des matiers
async function chargerMatieres() {
    try {
        const reponse = await fetch("/subjects");

        if (!reponse.ok) {
            console.error("Erreur lors du chargement des matieres :", reponse.status);
            return;
        }

        const matieres = await reponse.json();

        const corpsTableau = document.getElementById("corps-matieres");
        corpsTableau.innerHTML = "";

        matieres.forEach((matiere) => {
            const ligne = document.createElement("tr");
            ligne.innerHTML = `
                <td class="cellule-nom"><b>${matiere.nom}</b></td>
                <td>${matiere.professeur || "Non affecté"}</td>
                <td class="actions-ligne">
                    <button class="bouton-discret" data-action="modifier" data-id="${matiere.id}">✎</button>
                    <button class="bouton-discret" data-action="supprimer" data-id="${matiere.id}">🗑</button>
                </td>
            `;
            corpsTableau.appendChild(ligne);
        });
    } catch (err) {
        console.error("Erreur reseau :", err);
    }
}

chargerMatieres();

// pour la vue  des Absences
async function chargerAbsences(classe) {
    try {
        const reponse = await fetch(
            `/absences/classe/${encodeURIComponent(classe)}`,
        );

        if (!reponse.ok) {
            console.error("Erreur lors du chargement des absences :", reponse.status);
            return;
        }

        const absences = await reponse.json();

        const corpsTableau = document.getElementById("corps-absences");
        corpsTableau.innerHTML = "";

        if (absences.length === 0) {
            corpsTableau.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; color:#5b6478; padding:24px;">
                        Aucune absence trouvée pour « ${classe} ». Vérifiez l'orthographe de la classe.
                    </td>
                </tr>
            `;
            return;
        }

        absences.forEach((absence) => {
            const ligne = document.createElement("tr");
            const classeStatut =
                absence.status === "justifiee" ?
                "etiquette-justifiee" :
                "etiquette-non-justifiee";
            const texteStatut =
                absence.status === "justifiee" ? "Justifiée" : "Non justifiée";
            ligne.innerHTML = `
                <td class="cellule-nom"><b>${absence.nom} ${absence.prenom}</b></td>
                <td>${classe}</td>
                <td class="matricule">${absence.date}</td>
                <td><span class="etiquette-statut ${classeStatut}">${texteStatut}</span></td>
            `;
            corpsTableau.appendChild(ligne);
        });
    } catch (err) {
        console.error("Erreur reseau :", err);
    }
}

document
    .getElementById("bouton-filtrer-absences")
    .addEventListener("click", () => {
        const classe = document.getElementById("filtre-classe-absences").value;
        if (classe) chargerAbsences(classe);
    });

// pour la vue des utiisateurs

async function chargerUtilisateurs() {
    try {
        const reponse = await fetch("/users");

        if (!reponse.ok) {
            console.error(
                "Erreur lors du chargement des utilisateurs :",
                reponse.status,
            );
            return;
        }

        const utilisateurs = await reponse.json();

        const corpsTableau = document.getElementById("corps-utilisateurs");
        corpsTableau.innerHTML = "";

        utilisateurs.forEach((user) => {
            const ligne = document.createElement("tr");
            ligne.innerHTML = `
                <td class="cellule-nom"><b>${user.name}</b></td>
                <td><span class="etiquette-statut etiquette-${user.role}">${user.role}</span></td>
                <td class="matricule">${user.name}</td>
            `;
            corpsTableau.appendChild(ligne);
        });
    } catch (err) {
        console.error("Erreur reseau :", err);
    }
}

chargerUtilisateurs();

// fonction  Bouton de deconnexion

const boutonDeconnexion = document.querySelector(".bouton-deconnexion");
boutonDeconnexion.addEventListener("click", async() => {
    try {
        const reponse = await fetch("/auth/logout", {
            method: "POST",
        });

        if (!reponse.ok) {
            return console.error("DECONNEXION IMPOSSIBLE", reponse.status);
        }

        window.location.href = "index.html";
    } catch (err) {
        console.error("Erreur reseau :", err);
    }
});

//detection du bouton cliquer supprimer dans la vue des professeurs
document.getElementById('corps-professeurs').addEventListener('click', async(event) => {
    const bouton = event.target.closest('button');
    if (!bouton) return;

    const id = bouton.dataset.id;

    if (bouton.dataset.action === 'supprimer') {
        const confirmation = confirm('Supprimer ce professeur ?');
        if (!confirmation) return;

        try {
            const reponse = await fetch(`/teachers/${id}`, { method: 'DELETE' });
            const data = await reponse.json();

            if (!reponse.ok) {
                alert(data.error || 'Suppression impossible.');
                return;
            }

            chargerProfesseurs(); // recharge la liste pour voir le changement
        } catch (err) {
            console.error('Erreur reseau :', err);
        }
    } else if (bouton.dataset.action === 'modifier') {
        try {
            const reponse = await fetch(`/teachers/${id}`);
            const prof = await reponse.json();

            if (!reponse.ok) {
                alert('Impossible de recuperer ce professeur.');
                return;
            }

            ouvrirModaleModification(prof);
        } catch (err) {
            console.error('Erreur reseau :', err);
        }
    }
});

// parties des formulaires

// Ajout d'un professeur
const modaleAjoutProf = document.getElementById('modale-ajout-prof');
const boutonOuvrirModale = document.querySelector('#admin-professeurs .bouton-ajouter');
const boutonAnnulerProf = document.getElementById('bouton-annuler-prof');
const formulaireAjoutProf = document.getElementById('formulaire-ajout-prof');
const titreModaleProf = document.getElementById('titre-modale-prof');
const boutonSoumettreProf = document.getElementById('bouton-soumettre-prof');
const blocCodeAcces = document.getElementById('bloc-code-acces-prof');
const profIdEdition = document.getElementById('prof-id-edition');

function ouvrirModaleAjout() {
    formulaireAjoutProf.reset();
    profIdEdition.value = '';
    titreModaleProf.textContent = 'Ajouter un professeur';
    boutonSoumettreProf.textContent = 'Ajouter';
    blocCodeAcces.style.display = 'block';
    modaleAjoutProf.style.display = 'flex';
}

function ouvrirModaleModification(prof) {
    profIdEdition.value = prof.id;
    document.getElementById('prof-nouveau-nom').value = prof.nom;
    document.getElementById('prof-nouvelle-matiere').value = prof.matiere;
    document.getElementById('prof-nouvelle-classe').value = prof.classe;
    titreModaleProf.textContent = 'Modifier le professeur';
    boutonSoumettreProf.textContent = 'Enregistrer';
    blocCodeAcces.style.display = 'none'; // le code d'acces n'est pas modifiable ici
    modaleAjoutProf.style.display = 'flex';
}

boutonOuvrirModale.addEventListener('click', ouvrirModaleAjout);

boutonAnnulerProf.addEventListener('click', () => {
    modaleAjoutProf.style.display = 'none';
    formulaireAjoutProf.reset();
});

formulaireAjoutProf.addEventListener('submit', async(event) => {
    event.preventDefault();

    const idEdition = profIdEdition.value;
    const estModification = idEdition !== '';

    const body = {
        nom: document.getElementById('prof-nouveau-nom').value,
        matiere: document.getElementById('prof-nouvelle-matiere').value,
        classe: document.getElementById('prof-nouvelle-classe').value
    };

    if (!estModification) {
        body.codeAcces = document.getElementById('prof-nouveau-code').value;
    }

    const url = estModification ? `/teachers/${idEdition}` : '/teachers';
    const methode = estModification ? 'PUT' : 'POST';

    try {
        const reponse = await fetch(url, {
            method: methode,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await reponse.json();

        if (!reponse.ok) {
            alert(data.error || 'Operation impossible.');
            return;
        }

        modaleAjoutProf.style.display = 'none';
        formulaireAjoutProf.reset();
        chargerProfesseurs();

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
});

//  Ajout / Modification / Suppression d'un étudiant 
const modaleEtudiant = document.getElementById('modale-ajout-etudiant');
const boutonOuvrirModaleEtudiant = document.querySelector('#admin-etudiants .bouton-ajouter');
const boutonAnnulerEtudiant = document.getElementById('bouton-annuler-etudiant');
const formulaireEtudiant = document.getElementById('formulaire-ajout-etudiant');
const titreModaleEtudiant = document.getElementById('titre-modale-etudiant');
const boutonSoumettreEtudiant = document.getElementById('bouton-soumettre-etudiant');
const champMatriculeInput = document.getElementById('etudiant-nouveau-matricule');
const matriculeEdition = document.getElementById('etudiant-matricule-edition');

function ouvrirModaleAjoutEtudiant() {
    formulaireEtudiant.reset();
    matriculeEdition.value = '';
    titreModaleEtudiant.textContent = 'Ajouter un étudiant';
    boutonSoumettreEtudiant.textContent = 'Ajouter';
    champMatriculeInput.disabled = false;
    modaleEtudiant.style.display = 'flex';
}

function ouvrirModaleModificationEtudiant(etu) {
    matriculeEdition.value = etu.matricule;
    champMatriculeInput.value = etu.matricule;
    champMatriculeInput.disabled = true; // on ne change pas le matricule (identifiant) en modification
    document.getElementById('etudiant-nouveau-nom').value = etu.nom;
    document.getElementById('etudiant-nouveau-prenom').value = etu.prenom;
    document.getElementById('etudiant-nouvel-age').value = etu.age;
    document.getElementById('etudiant-nouvelle-classe').value = etu.classe;
    titreModaleEtudiant.textContent = 'Modifier l\'étudiant';
    boutonSoumettreEtudiant.textContent = 'Enregistrer';
    modaleEtudiant.style.display = 'flex';
}

boutonOuvrirModaleEtudiant.addEventListener('click', ouvrirModaleAjoutEtudiant);

boutonAnnulerEtudiant.addEventListener('click', () => {
    modaleEtudiant.style.display = 'none';
    formulaireEtudiant.reset();
});

formulaireEtudiant.addEventListener('submit', async(event) => {
    event.preventDefault();

    const estModification = matriculeEdition.value !== '';

    const body = {
        matricule: champMatriculeInput.value,
        nom: document.getElementById('etudiant-nouveau-nom').value,
        prenom: document.getElementById('etudiant-nouveau-prenom').value,
        age: document.getElementById('etudiant-nouvel-age').value,
        classe: document.getElementById('etudiant-nouvelle-classe').value
    };

    const url = estModification ? `/students/${matriculeEdition.value}` : '/students';
    const methode = estModification ? 'PUT' : 'POST';

    try {
        const reponse = await fetch(url, {
            method: methode,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await reponse.json();

        if (!reponse.ok) {
            alert(data.error || 'Operation impossible.');
            return;
        }

        modaleEtudiant.style.display = 'none';
        formulaireEtudiant.reset();
        champMatriculeInput.disabled = false;
        chargerEtudiants();

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
});

//  Clic sur modifier/supprimer dans la table etudiants 
document.getElementById('corps-etudiants').addEventListener('click', async(event) => {
    const bouton = event.target.closest('button');
    if (!bouton) return;

    const matricule = bouton.dataset.matricule;

    if (bouton.dataset.action === 'supprimer') {
        const confirmation = confirm('Supprimer cet étudiant ?');
        if (!confirmation) return;

        try {
            const reponse = await fetch(`/students/${matricule}`, { method: 'DELETE' });
            const data = await reponse.json();

            if (!reponse.ok) {
                alert(data.error || 'Suppression impossible.');
                return;
            }

            chargerEtudiants();
        } catch (err) {
            console.error('Erreur reseau :', err);
        }

    } else if (bouton.dataset.action === 'modifier') {
        try {
            const reponse = await fetch(`/students/${matricule}`);
            const etu = await reponse.json();

            if (!reponse.ok) {
                alert('Impossible de recuperer cet etudiant.');
                return;
            }

            ouvrirModaleModificationEtudiant(etu);
        } catch (err) {
            console.error('Erreur reseau :', err);
        }
    }
});

//  Ajout / Modification d'une matière 
const modaleMatiere = document.getElementById('modale-ajout-matiere');
const boutonOuvrirModaleMatiere = document.querySelector('#admin-matieres .bouton-ajouter');
const boutonAnnulerMatiere = document.getElementById('bouton-annuler-matiere');
const formulaireMatiere = document.getElementById('formulaire-ajout-matiere');
const titreModaleMatiere = document.getElementById('titre-modale-matiere');
const boutonSoumettreMatiere = document.getElementById('bouton-soumettre-matiere');
const blocNomMatiere = document.getElementById('bloc-nom-matiere');
const selectProfMatiere = document.getElementById('matiere-select-prof');
const matiereIdEdition = document.getElementById('matiere-id-edition');

boutonOuvrirModaleMatiere.addEventListener('click', async() => {
    formulaireMatiere.reset();
    matiereIdEdition.value = '';
    titreModaleMatiere.textContent = 'Ajouter une matière';
    boutonSoumettreMatiere.textContent = 'Ajouter';
    blocNomMatiere.style.display = 'block';
    document.getElementById('matiere-nouveau-nom').required = true;

    const profs = await recupererListeProfesseurs();
    remplirSelectProfesseurs(selectProfMatiere, profs);

    modaleMatiere.style.display = 'flex';
});

boutonAnnulerMatiere.addEventListener('click', () => {
    modaleMatiere.style.display = 'none';
    formulaireMatiere.reset();
});

formulaireMatiere.addEventListener('submit', async(event) => {
    event.preventDefault();

    const idEdition = matiereIdEdition.value;
    const estModification = idEdition !== '';
    const teacherIdValeur = selectProfMatiere.value;

    try {
        let reponse;

        if (estModification) {
            reponse = await fetch(`/subjects/${idEdition}/affecter`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherId: teacherIdValeur ? Number(teacherIdValeur) : null })
            });
        } else {
            reponse = await fetch('/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom: document.getElementById('matiere-nouveau-nom').value,
                    teacherId: teacherIdValeur ? Number(teacherIdValeur) : null
                })
            });
        }

        const data = await reponse.json();

        if (!reponse.ok) {
            alert(data.error || 'Operation impossible.');
            return;
        }

        modaleMatiere.style.display = 'none';
        formulaireMatiere.reset();
        chargerMatieres();

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
});

//  Clic sur modifier/supprimer dans la table matieres 
document.getElementById('corps-matieres').addEventListener('click', async(event) => {
    const bouton = event.target.closest('button');
    if (!bouton) return;

    const id = bouton.dataset.id;

    if (bouton.dataset.action === 'supprimer') {
        const confirmation = confirm('Supprimer cette matière ?');
        if (!confirmation) return;

        try {
            const reponse = await fetch(`/subjects/${id}`, { method: 'DELETE' });
            const data = await reponse.json();

            if (!reponse.ok) {
                alert(data.error || 'Suppression impossible.');
                return;
            }

            chargerMatieres();
        } catch (err) {
            console.error('Erreur reseau :', err);
        }

    } else if (bouton.dataset.action === 'modifier') {
        matiereIdEdition.value = id;
        titreModaleMatiere.textContent = 'Modifier le professeur affecté';
        boutonSoumettreMatiere.textContent = 'Enregistrer';
        blocNomMatiere.style.display = 'none'; // le nom n'est pas modifiable via /affecter
        document.getElementById('matiere-nouveau-nom').required = false;

        const profs = await recupererListeProfesseurs();
        remplirSelectProfesseurs(selectProfMatiere, profs);

        modaleMatiere.style.display = 'flex';
    }
});