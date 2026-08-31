// Navigation 
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

// Deconnexion 
document.querySelector('.bouton-deconnexion').addEventListener('click', async() => {
    try {
        const reponse = await fetch('/auth/logout', { method: 'POST' });
        if (!reponse.ok) return console.error('Deconnexion impossible', reponse.status);
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Erreur reseau :', err);
    }
});

//  Date du jour 
function afficherDateDuJour() {
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    document.querySelector('#etudiant-accueil .date-jour').textContent = new Date().toLocaleDateString('fr-FR', options);
}
afficherDateDuJour();

// Profil etudiant (via session) 
let profilEtudiant = null;

async function chargerProfilEtudiant() {
    try {
        const reponse = await fetch('/auth/profil');
        if (!reponse.ok) {
            console.error('Erreur chargement profil :', reponse.status);
            return;
        }
        const data = await reponse.json();
        profilEtudiant = data.user; // { id, matricule, role, nom, prenom, classe }

        document.getElementById('nom-utilisateur').textContent = `${profilEtudiant.nom} ${profilEtudiant.prenom}`;
        document.getElementById('avatar-utilisateur').textContent = profilEtudiant.nom.charAt(0).toUpperCase();
        document.querySelector('#etudiant-accueil .sous-titre').textContent = `${profilEtudiant.nom} ${profilEtudiant.prenom} · ${profilEtudiant.classe}`;
        document.querySelector('#etudiant-statistiques .sous-titre').textContent = profilEtudiant.classe;

        chargerAccueilEtudiant();
        chargerMesNotes();
        chargerMesAbsences();
        chargerStatistiquesClasseEtudiant();

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

chargerProfilEtudiant();

//  Accueil : moyenne, absences non justifiees, dernieres notes 
async function chargerAccueilEtudiant() {
    try {
        const reponseMoyenne = await fetch(`/grades/etudiant/${profilEtudiant.id}/moyenne`);
        const dataMoyenne = await reponseMoyenne.json();
        document.querySelector('#etudiant-accueil .carte-statistique:nth-child(1) .valeur').textContent = dataMoyenne.moyenne !== null ? dataMoyenne.moyenne : '—';

        const reponseAbsences = await fetch(`/absences/etudiant/${profilEtudiant.id}`);
        const absences = await reponseAbsences.json();
        const nonJustifiees = absences.filter(a => a.status === 'non_justifiee');
        document.querySelector('#etudiant-accueil .carte-statistique:nth-child(2) .valeur').textContent = nonJustifiees.length;

        const reponseNotes = await fetch(`/grades/etudiant/${profilEtudiant.id}`);
        const notes = await reponseNotes.json();
        // Meilleure note obtenue
        if (notes.length > 0) {
            const meilleureNote = Math.max(...notes.map(n => n.note));
            document.querySelector('#etudiant-accueil .carte-statistique:nth-child(3) .valeur').textContent = meilleureNote;
            document.querySelector('#etudiant-accueil .carte-statistique:nth-child(3) .variation').textContent = '/20';
        } else {
            document.querySelector('#etudiant-accueil .carte-statistique:nth-child(3) .valeur').textContent = '—';
            document.querySelector('#etudiant-accueil .carte-statistique:nth-child(3) .variation').textContent = 'aucune note';
        }

        const corps = document.querySelector('#etudiant-accueil .panneau table tbody');
        corps.innerHTML = '';

        if (notes.length === 0) {
            corps.innerHTML = '<tr><td colspan="2">Aucune note enregistrée.</td></tr>';
        } else {
            notes.slice(-5).reverse().forEach(n => {
                let classeBadge = '';
                if (n.note >= 14) classeBadge = 'bonne';
                else if (n.note >= 10) classeBadge = 'moyenne-note';

                const ligne = document.createElement('tr');
                ligne.innerHTML = `
                    <td class="cellule-nom"><b>${n.matiere}</b></td>
                    <td><span class="badge-note ${classeBadge}">${n.note}</span></td>
                `;
                corps.appendChild(ligne);
            });
        }

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

//  Mes notes (vue dediee) 
async function chargerMesNotes() {
    try {
        const reponseMoyenne = await fetch(`/grades/etudiant/${profilEtudiant.id}/moyenne`);
        const dataMoyenne = await reponseMoyenne.json();
        document.querySelector('#etudiant-notes .sous-titre').textContent = `Moyenne générale : ${dataMoyenne.moyenne !== null ? dataMoyenne.moyenne : '—'} / 20`;

        const reponseNotes = await fetch(`/grades/etudiant/${profilEtudiant.id}`);
        const notes = await reponseNotes.json();
        const corps = document.querySelector('#etudiant-notes tbody');
        corps.innerHTML = '';

        if (notes.length === 0) {
            corps.innerHTML = '<tr><td colspan="2">Aucune note enregistrée.</td></tr>';
            return;
        }

        notes.forEach(n => {
            let classeBadge = '';
            if (n.note >= 14) classeBadge = 'bonne';
            else if (n.note >= 10) classeBadge = 'moyenne-note';

            const ligne = document.createElement('tr');
            ligne.innerHTML = `
                <td class="cellule-nom"><b>${n.matiere}</b></td>
                <td><span class="badge-note ${classeBadge}">${n.note}</span></td>
            `;
            corps.appendChild(ligne);
        });

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

//  Mes absences 
async function chargerMesAbsences() {
    try {
        const reponse = await fetch(`/absences/etudiant/${profilEtudiant.id}`);
        const absences = await reponse.json();

        const conteneur = document.querySelector('#etudiant-absences .corps-panneau');

        if (absences.length === 0) {
            conteneur.innerHTML = `
                <div class="etat-vide">
                    <div class="icone">📗</div>
                    <b>Aucune absence enregistrée</b> Le cahier est vierge — continue comme ça.
                </div>
            `;
            return;
        }

        let tableauHtml = `
            <table>
                <thead><tr><th>Date</th><th>Statut</th></tr></thead>
                <tbody>
        `;
        absences.forEach(a => {
            const estJustifiee = a.status === 'justifiee';
            const classeStatut = estJustifiee ? 'etiquette-justifiee' : 'etiquette-non-justifiee';
            const texteStatut = estJustifiee ? 'Justifiée' : 'Non justifiée';
            tableauHtml += `
                <tr>
                    <td class="matricule">${a.date}</td>
                    <td><span class="etiquette-statut ${classeStatut}">${texteStatut}</span></td>
                </tr>
            `;
        });
        tableauHtml += '</tbody></table>';
        conteneur.innerHTML = tableauHtml;

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}

//  Statistiques de classe 
async function chargerStatistiquesClasseEtudiant() {
    try {
        const [reponseMeilleur, reponseMoyenne] = await Promise.all([
            fetch(`/stats/meilleur/${encodeURIComponent(profilEtudiant.classe)}`),
            fetch(`/stats/moyenne/${encodeURIComponent(profilEtudiant.classe)}`)
        ]);

        if (reponseMeilleur.ok) {
            const meilleur = await reponseMeilleur.json();
            const carte = document.querySelector('#etudiant-statistiques .carte-podium:first-child');
            carte.querySelector('.nom').textContent = `${meilleur.nom} ${meilleur.prenom}`;
            carte.querySelector('.chiffre-moyenne').textContent = meilleur.moyenne;

            const estMoi = meilleur.matricule === profilEtudiant.matricule;
            carte.querySelector('.details').textContent = estMoi ? "Meilleure étudiante — c'est toi !" : 'Meilleur(e) étudiant(e) de la classe';
        }

        if (reponseMoyenne.ok) {
            const dataMoyenne = await reponseMoyenne.json();
            const carte = document.querySelector('#etudiant-statistiques .carte-podium:last-child');
            carte.querySelector('.chiffre-moyenne').textContent = dataMoyenne.moyenne !== null ? dataMoyenne.moyenne : '—';
            carte.querySelector('.details').textContent = `Classe ${profilEtudiant.classe}`;
        }

    } catch (err) {
        console.error('Erreur reseau :', err);
    }
}