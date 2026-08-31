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