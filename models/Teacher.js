    const User = require("./User.js");
        class Teacher extends User {
            //  Hérite de User
            constructor(id, name, role, codeAcces, nom, matiere, classe) {
                super(id, name, role, codeAcces); // Initialise les props User
                this.nom = nom;
                this.matiere = matiere;
                this.classe = classe;
            }
            getInfo() {
                return `Prof #${this.id} - ${this.nom} - ${this.matiere} - Classe ${this.classe}`;
            }
        }
        module.exports = Teacher;