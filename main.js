    const { question, choixMenu, confirmer } = require('./utils/messagesReadline.js');
    const { logInfo } = require('./utils/logger.js');
    const authService = require('./services/authetification.js');
    const { initDatabase } = require('./db/table.js');
    const userService = require('./services/userServices.js');
    const studentService = require('./services/studentServices.js');
    const teacherService = require('./services/teacherServices.js');
    const subjectService = require('./services/subjectServices.js');
    const gradeService = require('./services/gradeServices.js');
    const absenceService = require('./services/absenceServices.js');
    const statsService = require('./services/meilleursEtudian.js');
    const db = require('./db/database.js');
    const { logError } = require('./utils/logger.js');
    // Gestion des erreurs non gérées et des promesses rejetées
    process.on('uncaughtException', (err) => {
        logError(`Erreur critique non geree : ${err.message}`);
        console.error('Une erreur critique est survenue. Consultez les logs.');
        process.exit(1);
    });
    process.on('unhandledRejection', (reason) => {
        logError(`Promesse rejetee : ${reason}`);
    });
    //  ECRAN D'ACCUEIL
    function ecranAccueil() {
        console.log('\n=== Bienvenue sur School Management ===');
        const choix = choixMenu(' Connecter vous a votre espace ?', ['Se connecter', 'Quitter']);
        if (choix === 2) {
            console.log('a bientot !');
            process.exit(0);
        }
        ecranConnexion();
    }
    //  ECRAN DE CONNEXION
    function ecranConnexion() {
        const role = choixMenu(' Ce connecter en tant  :', ['Administrateur', 'Professeur', 'Etudiant']);
        if (role === 1) {
            const name = question('Nom :');
            const code = question('Code d\'acces :');
            const user = authService.loginUser(name, code, 'admin');
            if (user && user.role === 'admin') {
                menuAdmin();
            } else {
                console.log('Identifiants incorrects.');
                ecranAccueil();
            }
        } else if (role === 2) {
            const name = question('Nom :');
            const code = question('Code d\'acces :');
            const user = authService.loginUser(name, code, 'professeur');
            if (user && user.role === 'professeur') {
                const fiche = teacherService.getProfesseurParUserId(user.id);
                menuProfesseur(fiche);
            } else {
                console.log('Identifiants incorrects.');
                ecranAccueil();
            }
        } else if (role === 3) {
            const matricule = question('Matricule :');
            const student = authService.loginStudent(matricule);
            if (student) {
                menuEtudiant(student);
            } else {
                console.log('Matricule introuvable.');
                ecranAccueil();
            }
        } else {
            ecranAccueil();
        }
    }
    //  MENU ADMIN 
    function menuAdmin() {
        const choix = choixMenu('=== MENU ADMINISTRATEUR ===', [
            'Ajouter un professeur',
            'Lister les professeurs',
            'Modifier un professeur',
            'Supprimer un professeur',
            'Ajouter un etudiant',
            'Lister les etudiants',
            'Modifier un etudiant',
            'Supprimer un etudiant',
            'Ajouter une matiere',
            'Affecter un professeur a une matiere',
            'Lister les matieres',
            'Supprimer une matiere',
            'Voir les absences d\'une classe',
            'Lister tous les utilisateurs',
            'Se deconnecter'
        ]);
        if (choix === 1) {
            const nom = question('Nom du professeur :');
            const matiere = question('Matiere enseignee :');
            const classe = question('Classe geree :');
            const code = question('Code d\'acces a creer :');
            const id = teacherService.ajouterProfesseur(nom, matiere, classe, code);
            console.log(id ? 'Professeur ajoute.' : 'Erreur : champs invalides.');
        } else if (choix === 2) {
            console.table(teacherService.listerProfesseurs());
        } else if (choix === 3) {
            const id = question('ID du professeur a modifier :');
            const prof = teacherService.rechercherProfesseur(Number(id));
            if (!prof) {
                console.log('Professeur introuvable.');
            } else {
                const nom = question(`Nom (${prof.nom}) :`) || prof.nom;
                const matiere = question(`Matiere (${prof.matiere}) :`) || prof.matiere;
                const classe = question(`Classe (${prof.classe}) :`) || prof.classe;
                const ok = teacherService.modifierProfesseur(Number(id), { nom, matiere, classe });
                console.log(ok ? 'Professeur modifie.' : 'Modification impossible.');
            }
        } else if (choix === 4) {
            const id = question('ID du professeur a supprimer :');
            const ok = teacherService.supprimerProfesseur(Number(id));
            if (ok) {
                console.log('Professeur supprime.');
            } else {
                console.log('Impossible de supprimer le professeur.');
            }
        } else if (choix === 5) {
            const matricule = question('Matricule :');
            const nom = question('Nom :');
            const prenom = question('Prenom :');
            const age = question('Age :');
            const classe = question('Classe :');
            const ok = studentService.ajouterEtudiant(matricule, nom, prenom, Number(age), classe);
            console.log(ok ? 'Etudiant ajoute.' : 'Erreur : matricule deja utilise.');
        } else if (choix === 6) {
            console.table(studentService.listerEtudiants());
        } else if (choix === 7) {
            const matricule = question('Matricule de l\'etudiant a modifier :');
            const etudiant = studentService.rechercherEtudiant(matricule);
            if (!etudiant) {
                console.log('Etudiant introuvable.');
            } else {
                const nom = question(`Nom (${etudiant.nom}) :`) || etudiant.nom;
                const prenom = question(`Prenom (${etudiant.prenom}) :`) || etudiant.prenom;
                const age = question(`Age (${etudiant.age}) :`) || etudiant.age;
                const classe = question(`Classe (${etudiant.classe}) :`) || etudiant.classe;
                const ok = studentService.modifierEtudiant(matricule, { nom, prenom, age: Number(age), classe });
                console.log(ok ? 'Etudiant modifie.' : 'Champs invalides.');
            }
        } else if (choix === 8) {
            const matricule = question('Matricule de l\'etudiant a supprimer :');
            const ok = studentService.supprimerEtudiant(matricule);
            console.log(ok ? 'Etudiant supprime.' : 'Impossible de supprimer l\'etudiant.');
        } else if (choix === 9) {
            const nom = question('Nom de la matiere :');
            const id = subjectService.ajouterMatiere(nom);
            console.log(id ? 'Matiere ajoutee.' : 'Erreur : nom vide.');
        } else if (choix === 10) {
            const subjectId = question('ID matiere :');
            const teacherId = question('ID professeur :');
            const ok = subjectService.affecterProfesseur(Number(subjectId), Number(teacherId));
            console.log(ok ? 'Affectation effectuee.' : 'Affectation impossible.');
        } else if (choix === 11) {
            console.table(subjectService.listerMatieres());
        } else if (choix === 12) {
            const subjectId = question('ID de la matiere a supprimer :');
            const ok = subjectService.supprimerMatiere(Number(subjectId));
            console.log(ok ? 'Matiere supprimee.' : 'Impossible de supprimer la matiere.');
        } else if (choix === 13) {
            const classe = question('Classe :');
            console.table(absenceService.historiqueClasse(classe));
        } else if (choix === 14) {
            console.table(userService.listerUsers());
        } else if (choix === 15) {
            ecranAccueil();
            return;
        }
        menuAdmin();
    }
    //  MENU PROFESSEUR 
    function menuProfesseur(prof) {
        const choix = choixMenu(`=== MENU PROFESSEUR (${prof.nom} - Classe ${prof.classe}) ===`, [
            'Lister mes etudiants',
            'Ajouter une note',
            'Modifier une note',
            'Supprimer une note',
            'Calculer la moyenne d\'un etudiant',
            'Voir toutes les notes d\'un etudiant',
            'Enregistrer une absence',
            'Marquer une absence',
            'Voir l\'historique d\'absences d\'un etudiant',
            'Compter les absences du jour (classe)',
            'Voir le meilleur etudiant de la classe',
            'Voir la moyenne generale de la classe',
            'Se deconnecter'
        ]);
        if (choix === 1) {
            console.table(studentService.listerEtudiants(prof.classe));
        } else if (choix === 2) {
            const matricule = question('Matricule etudiant :');
            const etudiant = studentService.rechercherEtudiant(matricule);
            if (!etudiant || etudiant.classe !== prof.classe) {
                console.log('Etudiant introuvable dans votre classe.');
            } else {
                const subjectId = question('ID matiere :');
                const note = question('Note (0-20) :');
                const ok = gradeService.ajouterNote(etudiant.id, Number(subjectId), Number(note));
                console.log(ok ? 'Note ajoutee.' : 'Note invalide.');
            }
        } else if (choix === 3) {
            const gradeId = question('ID de la note :');
            const note = question('Nouvelle note :');
            const ok = gradeService.modifierNote(Number(gradeId), Number(note));
            console.log(ok ? 'Note modifiee.' : 'Note invalide.');
        } else if (choix === 4) {
            const gradeId = question('ID de la note a supprimer :');
            const ok = gradeService.supprimerNote(Number(gradeId));
            console.log(ok ? 'Note supprimee.' : 'Note introuvable.');
        } else if (choix === 5) {
            const matricule = question('Matricule etudiant :');
            const etudiant = studentService.rechercherEtudiant(matricule);
            if (etudiant) {
                const moyenne = gradeService.moyenneEtudiant(etudiant.id);
                console.log(`Moyenne : ${moyenne !== null ? moyenne : 'aucune note'}`);
            }
        } else if (choix === 6) {
            const matricule = question('Matricule etudiant :');
            const etudiant = studentService.rechercherEtudiant(matricule);
            if (etudiant) {
                console.table(gradeService.notesEtudiant(etudiant.id));
            } else {
                console.log('Etudiant introuvable.');
            }
        } else if (choix === 7) {
            const matricule = question('Matricule etudiant :');
            const etudiant = studentService.rechercherEtudiant(matricule);
            const date = question('Date (AAAA-MM-JJ) :');
            if (!etudiant) {
                console.log('Etudiant introuvable.');
            } else {
                const ok = absenceService.enregistrerAbsence(etudiant.id, date);
                console.log(ok ? 'Absence enregistree.' : 'Date invalide,absence non enregistree');
            }
        } else if (choix === 8) {
            const absenceId = question('ID absence :');
            const justifiee = confirmer('Absence justifiee ?');
            const ok = absenceService.marquerStatut(Number(absenceId), justifiee ? 'justifiee' : 'non_justifiee');
            console.log(ok ? 'Statut marque.' : 'Absence introuvable.');
        } else if (choix === 9) {
            const matricule = question('Matricule etudiant :');
            const etudiant = studentService.rechercherEtudiant(matricule);
            if (etudiant) {
                console.table(absenceService.historiqueEtudiant(etudiant.id));
            } else {
                console.log('Etudiant introuvable.');
            }
        } else if (choix === 10) {
            const date = question('Date (AAAA-MM-JJ) :');
            const total = statsService.compterAbsencesJour(date, prof.classe);
            console.log(`Absences le ${date} pour la classe ${prof.classe} : ${total}`);
        } else if (choix === 11) {
            const meilleur = statsService.meilleurEtudiant(prof.classe);
            console.log(meilleur ? meilleur : 'Aucune note enregistree.');
        } else if (choix === 12) {
            const moyenne = statsService.moyenneGeneraleClasse(prof.classe);
            console.log(`Moyenne generale de la classe : ${moyenne !== null ? moyenne : 'aucune note'}`);
        } else if (choix === 13) {
            ecranAccueil();
            return;
        }
        menuProfesseur(prof);
    }
    //  MENU ETUDIANT 
    function menuEtudiant(etudiant) {
        const choix = choixMenu(`=== MENU ETUDIANT (${etudiant.prenom} ${etudiant.nom}) ===`, [
            'Voir mes notes',
            'Voir ma moyenne',
            'Voir mon historique d\'absences',
            'Voir le meilleur etudiant de la classe',
            'Voir la moyenne generale de la classe',
            'Se deconnecter'
        ]);
        if (choix === 1) {
            console.table(gradeService.notesEtudiant(etudiant.id));
        } else if (choix === 2) {
            const moyenne = gradeService.moyenneEtudiant(etudiant.id);
            console.log(`Ma moyenne : ${moyenne !== null ? moyenne : 'aucune note'}`);
        } else if (choix === 3) {
            console.table(absenceService.historiqueEtudiant(etudiant.id));
        } else if (choix === 4) {
            const meilleur = statsService.meilleurEtudiant(etudiant.classe);
            console.log(meilleur ? meilleur : 'Aucune note enregistree.');
        } else if (choix === 5) {
            const moyenne = statsService.moyenneGeneraleClasse(etudiant.classe);
            console.log(`Moyenne generale : ${moyenne !== null ? moyenne : 'aucune note'}`);
        } else if (choix === 6) {
            ecranAccueil();
            return;
        }
        menuEtudiant(etudiant);
    }
    //  Fonction pour initialiser la base de données et créer un compte admin par défaut
    function seedAdmin() {
        const existe = db.prepare(
            "SELECT id FROM users WHERE name = 'Admin' AND role = 'admin'"
        ).get();
        if (!existe) {
            userService.ajouterUser('Admin', 'admin', '1234');
            logInfo('Compte admin par defaut cree (identifiant: Admin / code: 1234)');
        }
    }

    // .get() est utilisé pour récupérer un seul enregistrement de la base de données. Si aucun enregistrement n'est trouvé, il retourne undefined. Dans ce cas, on vérifie si le compte admin existe déjà avant de le créer.
    initDatabase();
    seedAdmin();
    logInfo("Demarrage de l'application School Management");
    ecranAccueil();