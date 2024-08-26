const express = require('express');
require('dotenv').config();

const sql = require('../database/conexao');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { handleLogin } = require('../functions/authFunctions');

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
        const { name, tel, email, pass } = req.body;

        const user = await sql.one(`
            INSERT INTO users (name, tel, email, pass) VALUES ($1, $2, $3, $4);
            SELECT id_user, email FROM users WHERE email = $5;`,
            [name, tel, email, pass, email]
        )

        res.json({
            "id_user": user.id_user,
            "email": user.email,
            "token": gerarToken(user.id_user, user.email),
        });
    } catch (e) {
        res.status(500).send(`Erro ao criar usuario. ${e}`);
    }
});

function gerarToken(id_user, email){
    return jwt.sign({ id_user: id_user, email: email }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
}

module.exports = router;