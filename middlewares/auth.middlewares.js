const express = require('express');
const server  =  require("../server.js")
const authControlleur = require('../controller/auth.controller');
const loginUser = require('../services/authetification.js');
const loginStudent = require('../services/authetification.js');
async function authMiddleware(req, res, next) {
    try {
        if (authControlleur.connexion !== loginUser ) {
            res.status (401)
        }
    } catch (error) {
        
    }


}

module.exports = {authMiddleware};