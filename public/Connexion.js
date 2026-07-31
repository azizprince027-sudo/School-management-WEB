document.addEventListener('DOMContentLoaded', function() {

    var boutonsEspace = document.querySelectorAll('.bouton-espace');
    var champRole = document.getElementById('role-selectionne');
    var groupesChamp = document.querySelectorAll('[data-champ-espace]');
    var groupeCodeAcces = document.querySelector('[data-champ-code-acces]');

    function activerEspace(espace) {

        // Mise a jour visuelle des onglets
        boutonsEspace.forEach(function(bouton) {
            var estActif = bouton.getAttribute('data-espace') === espace;
            bouton.classList.toggle('bouton-espace--actif', estActif);
            bouton.setAttribute('aria-selected', estActif ? 'true' : 'false');
        });

        // Affichage du champ d'identification propre a l'espace choisi
        groupesChamp.forEach(function(groupe) {
            var correspond = groupe.getAttribute('data-champ-espace') === espace;
            groupe.hidden = !correspond;
            var champ = groupe.querySelector('.champ-texte');
            if (champ) {
                champ.disabled = !correspond;
            }
        });

        // Le code d'acces n'existe pas pour l'espace etudiant
        var codeAcces = groupeCodeAcces.querySelector('.champ-texte');
        if (espace === 'etudiant') {
            groupeCodeAcces.hidden = true;
            if (codeAcces) {
                codeAcces.disabled = true;
                codeAcces.value = '';
            }
        } else {
            groupeCodeAcces.hidden = false;
            if (codeAcces) {
                codeAcces.disabled = false;
            }
        }

        champRole.value = espace;
    }

    boutonsEspace.forEach(function(bouton) {
        bouton.addEventListener('click', function() {
            activerEspace(bouton.getAttribute('data-espace'));
        });
    });

    activerEspace('administrateur');
});