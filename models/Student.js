class Student {
    // Le constructeur de la classe "Student" est une fonction spéciale qui est appelée lors de la création d'une nouvelle instance de la classe. Il prend plusieurs paramètres (id, matricule, nom, prenom, age, classe) et les assigne aux propriétés correspondantes de l'objet créé. Cela permet d'initialiser les données d'un étudiant avec les valeurs fournies lors de la création de l'instance.
    constructor(id, matricule, nom, prenom, age, classe) {
            this.id = id;
            this.matricule = matricule;
            this.nom = nom;
            this.prenom = prenom;
            this.age = age;
            this.classe = classe;
        }
        // La méthode "getInfo" est une fonction définie dans la classe "Student" qui retourne une chaîne de caractères formatée contenant les informations de l'étudiant. Elle utilise les propriétés de l'objet (matricule, nom, prenom, age, classe) pour construire une description complète de l'étudiant, facilitant ainsi l'affichage de ses détails dans l'application.
    getInfo() {
        return `${this.matricule} - ${this.nom} ${this.prenom} (${this.age} ans) - Classe ${this.classe}`;
    }
}

module.exports = Student;