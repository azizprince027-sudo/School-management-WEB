// --- Gestion des onglets de rôle ---
const boutonsRole = document.querySelectorAll('.onglets-role button');
const zonesChamps = {
    admin: document.getElementById('champs-admin'),
    prof: document.getElementById('champs-professeur'),
    etudiant: document.getElementById('champs-etudiant')
};

let roleActif = 'admin';

boutonsRole.forEach(bouton => {
    bouton.addEventListener('click', () => {
        const role = bouton.dataset.role;
        roleActif = role;

        boutonsRole.forEach(b => b.classList.remove('actif'));
        bouton.classList.add('actif');

        Object.keys(zonesChamps).forEach(cle => {
            zonesChamps[cle].style.display = (cle === role) ? 'block' : 'none';
        });
    });
});

// --- Gestion de la soumission du formulaire ---
const formulaire = document.getElementById('formulaire-connexion');

formulaire.addEventListener('submit', async(event) => {
    event.preventDefault();

    let url, body;

    if (roleActif === 'etudiant') {
        url = '/auth/login-etudiant';
        body = { matricule: document.getElementById('etudiant-matricule').value };
    } else {
        url = '/auth/login';
        const role = (roleActif === 'admin') ? 'admin' : 'professeur';
        const nomInput = (roleActif === 'admin') ? 'admin-nom' : 'prof-nom';
        const codeInput = (roleActif === 'admin') ? 'admin-code' : 'prof-code';
        body = {
            name: document.getElementById(nomInput).value,
            codeAcces: document.getElementById(codeInput).value,
            role: role
        };
    }

    try {
        const reponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await reponse.json();

        if (!reponse.ok) {
            alert(data.error || 'Erreur de connexion.');
            return;
        }

        if (roleActif === 'admin') {
            window.location.href = 'tableauAdmin.html';
        } else if (roleActif === 'prof') {
            window.location.href = 'tableauProf.html';
        } else {
            window.location.href = 'tableauEtud.html';
        }

    } catch (err) {
        console.error('Erreur reseau :', err);
        alert('Identifiants invalides.');
    }
});