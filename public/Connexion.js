let roleActuel = 'admin';

function selectionnerRole(role){
    roleActuel = role;
    document.querySelectorAll('.onglets-role button').forEach(b => b.classList.toggle('actif', b.dataset.role === role));
    document.querySelectorAll('.champs-role').forEach(f => f.style.display = 'none');
    const idChamps = role === 'prof' ? 'champs-professeur' : 'champs-' + role;
    document.getElementById(idChamps).style.display = 'block';
}

// Pour l'instant cette fonction affiche juste le tableau de bord (donnees fictives).
// Reste a faire : appeler /auth/login ou /auth/login-etudiant selon roleActuel,
// et remplacer les donnees en dur par la reponse du serveur.
function connecter(event){
    if (event) event.preventDefault();

    document.getElementById('ecran-connexion').style.display = 'none';
    const tableau = document.getElementById('tableau-de-bord');
    tableau.classList.add('visible');

    document.querySelectorAll('[data-espace]').forEach(s => s.style.display = 'none');
    document.getElementById('menu-admin').style.display = 'none';
    document.getElementById('menu-professeur').style.display = 'none';
    document.getElementById('menu-etudiant').style.display = 'none';

    const espaceMap = { admin: 'admin', prof: 'professeur', etudiant: 'etudiant' };
    const libelleMap = { admin: 'Administrateur', prof: 'Professeur', etudiant: 'Étudiant' };
    const nomMap = { admin: 'Admin', prof: 'Mme Kouadio', etudiant: 'KOFFI Aya' };

    document.querySelector('[data-espace="' + espaceMap[roleActuel] + '"]').style.display = 'block';
    document.getElementById('menu-' + espaceMap[roleActuel]).style.display = 'block';
    document.getElementById('etiquette-role').textContent = roleActuel;
    document.getElementById('role-utilisateur').textContent = libelleMap[roleActuel];
    document.getElementById('nom-utilisateur').textContent = nomMap[roleActuel];
    document.getElementById('avatar-utilisateur').textContent = nomMap[roleActuel].charAt(0);

    return false;
}

function afficherVue(espace, idVue, bouton){
    document.querySelectorAll('[data-espace="' + espace + '"] .vue').forEach(v => v.classList.remove('actif'));
    document.getElementById(idVue).classList.add('actif');
    bouton.parentElement.querySelectorAll('.element-menu').forEach(b => b.classList.remove('actif'));
    bouton.classList.add('actif');
    document.getElementById('barre-laterale').classList.remove('ouvert');
}

function deconnecter(){
    document.getElementById('tableau-de-bord').classList.remove('visible');
    document.getElementById('ecran-connexion').style.display = 'flex';
}