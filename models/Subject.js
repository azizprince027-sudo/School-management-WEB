class Subject {
    // Le constructeur de la classe "Subject" est une fonction spéciale qui est appelée lors de la création d'une nouvelle instance de la classe. Il prend trois paramètres : "id", "nom" et "teacherId". Ces paramètres sont utilisés pour initialiser les propriétés de l'objet "Subject". La propriété "id" représente l'identifiant unique de la matière, "nom" représente le nom de la matière, et "teacherId" représente l'identifiant de l'enseignant associé à cette matière. En utilisant ce constructeur, on peut facilement créer des objets "Subject" avec les informations nécessaires.
    constructor(id, nom, teacherId) {
        this.id = id;
        this.nom = nom;
        this.teacherId = teacherId;
    }

}
// La classe "Subject" représente une matière enseignée dans l'école. Elle contient des propriétés pour stocker l'identifiant de la matière, son nom et l'identifiant de l'enseignant qui la dispense. Cette classe peut être utilisée pour créer des objets représentant différentes matières, facilitant ainsi la gestion des matières dans l'application de gestion scolaire.
module.exports = Subject;