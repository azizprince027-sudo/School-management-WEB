    let roleActuel = "admin";

    // Selectionne le role de l'utilisateur (admin/professeur/etudiant) et affiche les champs correspondants.
    function selectionnerRole(role) {
    roleActuel = role;
    document
        .querySelectorAll(".onglets-role button")
        .forEach((b) => b.classList.toggle("actif", b.dataset.role === role));
    document
        .querySelectorAll(".champs-role")
        .forEach((f) => (f.style.display = "none"));
    const idChamps = role === "prof" ? "champs-professeur" : "champs-" + role;
    document.getElementById(idChamps).style.display = "block";
    }

    // Pour l'instant cette fonction redirige juste vers le tableau de bord du role choisi
    // (donnees fictives cote page de destination).
    // Reste a faire : appeler /auth/login ou /auth/login-etudiant selon roleActuel,
    // et transmettre la reponse du serveur a la page de destination.
    function connecter(event) {
    if (event) event.preventDefault();

    const pageParRole = {
        admin: "tableauAdmin.html",
        prof: "tableauProf.html",
        etudiant: "tableauEtud.html",
    };

    window.location.href = pageParRole[roleActuel];

    return false;
    }
