const readlineSync = require('readline-sync');
// Ce module fournit des fonctions pour interagir avec l'utilisateur via la ligne de commande. Il permet de poser des questions, de présenter des choix de menu et de demander des confirmations, facilitant ainsi la création d'une interface utilisateur simple pour les applications en ligne de commande.
function question(message) {
    return readlineSync.question(message + ' ');
}
// La fonction "question" affiche un message à l'utilisateur et attend une réponse. Elle utilise la méthode "question" de readlineSync pour lire l'entrée de l'utilisateur et la retourner sous forme de chaîne de caractères.
function choixMenu(titre, options) {
    console.log('\n' + titre);
    options.forEach((opt, i) => console.log(`${i + 1}) ${opt}`));
    const choix = readlineSync.questionInt('Votre choix : ');
    return choix;
}
// La fonction "choixMenu" affiche un titre suivi d'une liste d'options numérotées. Elle utilise la méthode "questionInt" de readlineSync pour lire un choix numérique de l'utilisateur, qui correspond à l'index de l'option sélectionnée. Le choix est ensuite retourné pour être utilisé dans le programme.
function confirmer(message) {
    const rep = readlineSync.question(message + ' (o/n) ').toLowerCase();
    return rep === 'o' || rep === 'oui';
}
module.exports = { question, choixMenu, confirmer };