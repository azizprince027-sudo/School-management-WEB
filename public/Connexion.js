    document.addEventListener('DOMContentLoaded', function() {

        const conteneurOnglets = document.getElementById('conteneurs-onglet');
        const onglets = conteneurOnglets.querySelectorAll('.roles');

        onglets.forEach(function(onglet) {
            onglet.addEventListener('click', function() {

                // on retire la classe active de tous les onglets
                onglets.forEach(function(o) {
                    o.classList.remove('switch-js');
                });

                // on l'ajoute uniquement à celui cliqué
                onglet.classList.add('switch-js');

                // on récupère le rôle choisi
                const roleChoisi = onglet.textContent.trim();
                mettreAJourChamps(roleChoisi);

            });
        });

        function mettreAJourChamps(role) {
            const champInputs = document.querySelectorAll('.champ-input');
            const champIdentifiant = champInputs[0];
            const champCode = champInputs[1];

            if (role === 'Administrateur') {
                champIdentifiant.value = 'Admin';
                champCode.value = '1234';
            } else if (role === 'Professeur') {
                champIdentifiant.value = 'Prof';
                champCode.value = '5678';
            } else if (role === 'Étudiant') {
                champIdentifiant.value = 'Etudiant';
                champCode.value = '0000';
            }
        }

    });