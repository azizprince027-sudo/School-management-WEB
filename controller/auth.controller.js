class Authcontrolleur {
    static async inscriptions (req,res)  {
        const body = req.body;
        res.json({
            status : true,
            message: 'inscription reusite',
        });
    }
    static async connexion (req , res){
        const body = req.body;
        res.json({
            status : true,
            message: 'connecter avec succes'
        });
    }
}

module.exports={
    AUTHcontrolleur
}