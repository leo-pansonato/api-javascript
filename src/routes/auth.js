const express = require('express');
require('dotenv').config();

const router = express.Router();

const { handleLogin, handleSignin } = require('../functions/authFunctions');

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;

        // Verifica se os campos estão preenchidos  
        if (!email || !pass) return res.json({login: false, message: "Email ou senha não informados."});

        return res.json(await handleLogin(email, pass));

    } catch (e) {
        res.status(500).send(`Erro ao logar. ${e}`);
    }
});

// CADASTRAR
router.post('/cadastro', async (req, res) => {
    try {
        const { name, email, tel, pass } = req.body;

        // Verifica se os campos estão preenchidos  
        if (!name || !email || !tel || !pass) return res.json({login: false, message: "Dados incompletos."});

        return res.json(await handleSignin(name, email, tel, pass));

    } catch (e) {
        res.status(500).send(`Erro ao cadastrar. ${e}`);
    }
});

module.exports = router;