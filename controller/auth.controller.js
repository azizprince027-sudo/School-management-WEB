class authControlleur {
    static async inscriptions(req, res) {
        const body = req.body;

        res.json({
            status: true,
            message: "Inscription réussie"
        });
    }

    static async connexion(req, res) {
        const body = req.body;

        res.json({
            status: true,
            message: "Connecté avec succès"
        });
    }
}

module.exports = authControlleur;