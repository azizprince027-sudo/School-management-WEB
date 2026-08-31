//  Navigation entre les vues 
const boutonsMenu = document.querySelectorAll('.element-menu');
const vues = document.querySelectorAll('.vue');

boutonsMenu.forEach(bouton => {
    bouton.addEventListener('click', () => {
        const cibleId = bouton.dataset.vue;
        boutonsMenu.forEach(b => b.classList.remove('actif'));
        vues.forEach(v => v.classList.remove('actif'));
        bouton.classList.add('actif');
        document.getElementById(cibleId).classList.add('actif');
    });
});

//  Menu mobile 
const boutonMenuMobile = document.querySelector('.bouton-menu');
const barreLaterale = document.getElementById('barre-laterale');
boutonMenuMobile.addEventListener('click', () => barreLaterale.classList.toggle('ouvert'));
document.addEventListener('click', (event) => {
    if (!barreLaterale.contains(event.target) && !boutonMenuMobile.contains(event.target)) {
        barreLaterale.classList.remove('ouvert');
    }
});

function afficherDateDuJour() {
    const maintenant = new Date();
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    document.querySelector('#professeur-accueil .date-jour').textContent = maintenant.toLocaleDateString('fr-FR', options);
}

afficherDateDuJour();

//  Deconnexion 
document.querySelector('.bouton-deconnexion').addEventListener('click', async() => {
    try {
        const reponse = await fetch('/auth/logout', { method: 'POST' });
        if (!reponse.ok) return console.error('Deconnexion impossible', reponse.status);
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Erreur reseau :', err);
    }
});

//  Profil + donnees de base (classe, matiere) ---
let profilProf = null; // stocke { id, user_id, nom, matiere, classe }

async function chargerProfil() {
    try {
        const reponse = await fetch('/teachers/moi/profil');
        if (!reponse.ok) {
            console.error('Erreur chargement profil :', reponse.status);
            return;
        }
        profilProf = await reponse.json();
        document.getElementById('nom-utilisateur').textContent = profilProf.nom;
        document.getElementById('avatar-utilisateur').textContent = profilProf.nom.charAt(0).toUpperCase();
        document.querySelector('#professeur-accueil .sous-titre').textContent = `Classe ${profilProf.classe} · ${profilProf.matiere}`;

        chargerStatsAccueil();
        chargerMesEtudiants();
        initVueNotes();
        initVueAbsences();
        chargerStatistiquesProf();
        chargerMoyenneGeneraleAccueil();
        chargerAbsencesAujourdhuiAccueil();
        chargerDernieresNotesAccueil();
        chargerPodiumAccueil();

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

chargerProfil();

// Stats accueil (etudiants de la classe + moyenne generale) 
async function chargerStatsAccueil() {
    try {
        const reponse = await fetch(`/students?classe=${encodeURIComponent(profilProf.classe)}`);
        if (!reponse.ok) return;
        const etudiants = await reponse.json();

        document.querySelector('#professeur-accueil .carte-statistique .valeur').textContent = etudiants.length;

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}
// Liste des etudiants de la classe
async function chargerMesEtudiants() {
    try {
        const reponse = await fetch(`/students?classe=${encodeURIComponent(profilProf.classe)}`);
        if (!reponse.ok) {
            console.error('Erreur chargement etudiants :', reponse.status);
            return;
        }
        const etudiants = await reponse.json();

        document.querySelector('#professeur-etudiants .sous-titre').textContent = `${profilProf.classe} · ${etudiants.length} étudiants`;

        const corpsTableau = document.querySelector('#professeur-etudiants tbody');
        corpsTableau.innerHTML = '';

        if (etudiants.length === 0) {
            corpsTableau.innerHTML = '<tr><td colspan="3">Aucun étudiant dans cette classe.</td></tr>';
            return;
        }

        for (const etu of etudiants) {
            const reponseMoyenne = await fetch(`/grades/etudiant/${etu.id}/moyenne`);
            const dataMoyenne = await reponseMoyenne.json();
            const moyenne = dataMoyenne.moyenne;

            let classeBadge = '';
            if (moyenne === null) classeBadge = '';
            else if (moyenne >= 14) classeBadge = 'bonne';
            else if (moyenne >= 10) classeBadge = 'moyenne-note';

            const ligne = document.createElement('tr');
            ligne.innerHTML = `
                <td class="matricule">${etu.matricule}</td>
                <td class="cellule-nom"><b>${etu.nom} ${etu.prenom}</b></td>
                <td>${moyenne !== null ? `<span class="badge-note ${classeBadge}">${moyenne}</span>` : '—'}</td>
            `;
            corpsTableau.appendChild(ligne);
        }

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

let idMatiereProf = null;
//trouver l'id de la matiere du prof pour l'ajout de notes
async function trouverMatiereDuProf() {
    const reponse = await fetch('/subjects');
    const matieres = await reponse.json();
    const matiere = matieres.find(m => m.professeur === profilProf.nom);
    idMatiereProf = matiere ? matiere.id : null;
}
//remplir le select des etudiants pour l'ajout de notes
async function remplirSelectEtudiantsNotes() {
    const reponse = await fetch(`/students?classe=${encodeURIComponent(profilProf.classe)}`);
    const etudiants = await reponse.json();
    const select = document.getElementById('note-select-etudiant');
    select.innerHTML = '';
    etudiants.forEach(etu => {
        const option = document.createElement('option');
        option.value = etu.id;
        option.textContent = `${etu.nom} ${etu.prenom}`;
        select.appendChild(option);
    });
}
//  Gestion des notes (vue notes)
async function chargerNotesVue() {
    const corpsTableau = document.getElementById('corps-notes');
    corpsTableau.innerHTML = '';

    const reponseEtudiants = await fetch(`/students?classe=${encodeURIComponent(profilProf.classe)}`);
    const etudiants = await reponseEtudiants.json();

    for (const etu of etudiants) {
        const reponseNotes = await fetch(`/grades/etudiant/${etu.id}`);
        const notes = await reponseNotes.json();

        notes.forEach(note => {
            let classeBadge = '';
            if (note.note >= 14) classeBadge = 'bonne';
            else if (note.note >= 10) classeBadge = 'moyenne-note';

            const ligne = document.createElement('tr');
            ligne.innerHTML = `
                <td class="cellule-nom"><b>${etu.nom} ${etu.prenom}</b></td>
                <td><span class="badge-note ${classeBadge}">${note.note}</span></td>
                <td class="actions-ligne">
                    <button class="bouton-discret" data-action="modifier-note" data-id="${note.id}" data-note="${note.note}">✎</button>
                    <button class="bouton-discret" data-action="supprimer-note" data-id="${note.id}">🗑</button>                </td>
            `;
            corpsTableau.appendChild(ligne);
        });
    }
}
//  Initialisation de la vue notes
async function initVueNotes() {
    await trouverMatiereDuProf();
    await remplirSelectEtudiantsNotes();
    await chargerNotesVue();
}

document.getElementById('formulaire-note').addEventListener('submit', async (event) => {
    event.preventDefault();

    const body = {
        studentId: document.getElementById('note-select-etudiant').value,
        subjectId: idMatiereProf,
        note: document.getElementById('note-valeur').value
    };
//  Gestion de l'ajout d'une note
    try {
        const reponse = await fetch('/grades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await reponse.json();

        if (!reponse.ok) {
            alert(data.error || 'Ajout impossible.');
            return;
        }

        event.target.reset();
        chargerNotesVue();

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
});
//  Gestion de la suppression d'une note

document.getElementById('corps-notes').addEventListener('click', async (event) => {
    const bouton = event.target.closest('button');
    if (!bouton) return;

    if (bouton.dataset.action === 'supprimer-note') {
        const confirmation = confirm('Supprimer cette note ?');
        if (!confirmation) return;

        try {
            const reponse = await fetch(`/grades/${bouton.dataset.id}`, { method: 'DELETE' });
            const data = await reponse.json();

            if (!reponse.ok) {
                alert(data.error || 'Suppression impossible.');
                return;
            }
            chargerNotesVue();
        } catch (err) {
            console.error('Erreur reseau :', err);
        }

    } else if (bouton.dataset.action === 'modifier-note') {
        document.getElementById('note-id-edition').value = bouton.dataset.id;
        document.getElementById('note-valeur-edition').value = bouton.dataset.note;
        document.getElementById('modale-note').style.display = 'flex';
    }
});

document.getElementById('bouton-annuler-note').addEventListener('click', () => {
    document.getElementById('modale-note').style.display = 'none';
});

document.getElementById('formulaire-modifier-note').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('note-id-edition').value;
    const nouvelleNote = document.getElementById('note-valeur-edition').value;

    try {
        const reponse = await fetch(`/grades/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: nouvelleNote })
        });
        const data = await reponse.json();

        if (!reponse.ok) {
            alert(data.error || 'Modification impossible.');
            return;
        }

        document.getElementById('modale-note').style.display = 'none';
        chargerNotesVue();

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
});


async function remplirSelectEtudiantsAbsences() {
    const reponse = await fetch(`/students?classe=${encodeURIComponent(profilProf.classe)}`);
    const etudiants = await reponse.json();
    const select = document.getElementById('absence-select-etudiant');
    select.innerHTML = '';
    etudiants.forEach(etu => {
        const option = document.createElement('option');
        option.value = etu.id;
        option.textContent = `${etu.nom} ${etu.prenom}`;
        select.appendChild(option);
    });
}
// Absencces
async function chargerAbsencesVue() {
    const corpsTableau = document.getElementById('corps-absences-prof');
    corpsTableau.innerHTML = '';

    const reponse = await fetch(`/absences/classe/${encodeURIComponent(profilProf.classe)}`);
    const absences = await reponse.json();

    if (absences.length === 0) {
        corpsTableau.innerHTML = '<tr><td colspan="4">Aucune absence enregistrée.</td></tr>';
        return;
    }

    absences.forEach(absence => {
    const estJustifiee = absence.status === 'justifiee';
    const classeStatut = estJustifiee ? 'etiquette-justifiee' : 'etiquette-non-justifiee';
    const texteStatut = estJustifiee ? 'Justifiée' : 'Non justifiée';
    const texteBouton = estJustifiee ? 'Marquer non justifiée' : 'Justifier';
    const nouveauStatut = estJustifiee ? 'non_justifiee' : 'justifiee';

    const ligne = document.createElement('tr');
    ligne.innerHTML = `
        <td class="cellule-nom"><b>${absence.nom} ${absence.prenom}</b></td>
        <td class="matricule">${absence.date}</td>
        <td><span class="etiquette-statut ${classeStatut}">${texteStatut}</span></td>
        <td class="actions-ligne">
            <button class="bouton-discret" data-action="switch-statut" data-id="${absence.id}" data-nouveau-statut="${nouveauStatut}">${texteBouton}</button>
        </td>
    `;
    corpsTableau.appendChild(ligne);
});
}

async function initVueAbsences() {
    await remplirSelectEtudiantsAbsences();
    await chargerAbsencesVue();
}
// enregistrement d absences
document.getElementById('formulaire-absence').addEventListener('submit', async (event) => {
    event.preventDefault();

    const body = {
        studentId: document.getElementById('absence-select-etudiant').value,
        date: document.getElementById('absence-date').value
    };

    try {
        const reponse = await fetch('/absences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await reponse.json();

        if (!reponse.ok) {
            alert(data.error || 'Enregistrement impossible.');
            return;
        }

        event.target.reset();
        chargerAbsencesVue();

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
});
// justifications
document.getElementById('corps-absences-prof').addEventListener('click', async (event) => {
    const bouton = event.target.closest('button');
    if (!bouton || bouton.dataset.action !== 'switch-statut') return;

    try {
        const reponse = await fetch(`/absences/${bouton.dataset.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: bouton.dataset.nouveauStatut })
        });
        const data = await reponse.json();

        if (!reponse.ok) {
            alert(data.error || 'Impossible de modifier le statut.');
            return;
        }
        chargerAbsencesVue();
    } catch (err) {
        console.error('Erreur reseau :', err);
    }
});

async function chargerStatistiquesProf() {
    try {
        const [reponseMeilleur, reponseMoyenne] = await Promise.all([
            fetch(`/stats/meilleur/${encodeURIComponent(profilProf.classe)}`),
            fetch(`/stats/moyenne/${encodeURIComponent(profilProf.classe)}`)
        ]);

        if (reponseMeilleur.ok) {
            const meilleur = await reponseMeilleur.json();
            const cartePodium = document.querySelector('#professeur-statistiques .carte-podium:first-child');
            cartePodium.querySelector('.nom').textContent = `${meilleur.nom} ${meilleur.prenom}`;
            cartePodium.querySelector('.chiffre-moyenne').textContent = meilleur.moyenne;
        }

        if (reponseMoyenne.ok) {
            const dataMoyenne = await reponseMoyenne.json();
            const carteMoyenne = document.querySelector('#professeur-statistiques .carte-podium:last-child');
            carteMoyenne.querySelector('.chiffre-moyenne').textContent = dataMoyenne.moyenne !== null ? dataMoyenne.moyenne : '—';
            carteMoyenne.querySelector('.details').textContent = `Classe ${profilProf.classe}`;
        }

        document.querySelector('#professeur-statistiques .sous-titre').textContent = profilProf.classe;

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

async function chargerMoyenneGeneraleAccueil() {
    try {
        const reponse = await fetch(`/stats/moyenne/${encodeURIComponent(profilProf.classe)}`);
        if (!reponse.ok) return;
        const data = await reponse.json();
        document.querySelector('#professeur-accueil .carte-statistique:nth-child(2) .valeur').textContent = data.moyenne !== null ? data.moyenne : '—';
    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

async function chargerAbsencesAujourdhuiAccueil() {
    try {
        const reponse = await fetch(`/absences/classe/${encodeURIComponent(profilProf.classe)}`);
        if (!reponse.ok) return;
        const absences = await reponse.json();
        const aujourdhui = new Date().toISOString().split('T')[0];
        const nonJustifieesAujourdhui = absences.filter(a => a.date === aujourdhui && a.status === 'non_justifiee');
        document.querySelector('#professeur-accueil .carte-statistique:nth-child(3) .valeur').textContent = nonJustifieesAujourdhui.length;
    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

async function chargerDernieresNotesAccueil() {
    try {
        const reponse = await fetch(`/students?classe=${encodeURIComponent(profilProf.classe)}`);
        const etudiants = await reponse.json();

        let toutesNotes = [];
        for (const etu of etudiants) {
            const r = await fetch(`/grades/etudiant/${etu.id}`);
            const notes = await r.json();
            notes.forEach(n => toutesNotes.push({ ...n, etudiantNom: `${etu.nom} ${etu.prenom}` }));
        }

        toutesNotes.sort((a, b) => b.id - a.id); // id decroissant = plus recent en premier
        const dernieres = toutesNotes.slice(0, 5);

        const corps = document.querySelector('#professeur-accueil .panneau table tbody');
        corps.innerHTML = '';

        if (dernieres.length === 0) {
            corps.innerHTML = '<tr><td colspan="2">Aucune note enregistrée.</td></tr>';
            return;
        }

        dernieres.forEach(n => {
            let classeBadge = '';
            if (n.note >= 14) classeBadge = 'bonne';
            else if (n.note >= 10) classeBadge = 'moyenne-note';

            const ligne = document.createElement('tr');
            ligne.innerHTML = `
                <td class="cellule-nom"><b>${n.etudiantNom}</b><span>${profilProf.classe}</span></td>
                <td><span class="badge-note ${classeBadge}">${n.note}</span></td>
            `;
            corps.appendChild(ligne);
        });
    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

async function chargerPodiumAccueil() {
    try {
        const reponse = await fetch(`/stats/meilleur/${encodeURIComponent(profilProf.classe)}`);
        if (!reponse.ok) return;
        const meilleur = await reponse.json();
        const carte = document.querySelector('#professeur-accueil .carte-podium');
        carte.querySelector('.nom').textContent = `${meilleur.nom} ${meilleur.prenom}`;
        carte.querySelector('.chiffre-moyenne').textContent = meilleur.moyenne;
    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}