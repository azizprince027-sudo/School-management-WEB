require('dotenv').config();
const express = require('express');
const authrouter = require('./routes/auth.routes');
const server = express();
const PORT = 3000;
    server.use(express.json());
    server.use(express.static("public"));
    server.use(express.urlencoded());
    server.use('/auth' , authrouter);

























server.listen(PORT, (err)=>{
    if (err) {
        console.error('Erreur lors du démarrage du serveur:', err);
    } else {
        console.log(`Server lancer sur http://localhost:${PORT}`);
    }
});

module.exports =  {
    server
} ;