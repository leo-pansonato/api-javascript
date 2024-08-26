require('dotenv').config();

const bcrypt = require('bcrypt');
const sql = require('../database/conexao');


/**
 * @param user_email O email que será utilizado.
 * @param user_pass A senha que será utilizada para o login.
 * @return Retorna `id_user` e `token` ou menssagem de erro.
 */
async function  handleLogin (user_email, user_pass)  {
    try {
        // Procura pelo usuário com email e senha
        const response = await sql.oneOrNone(`SELECT id_user, email FROM users WHERE email = $1 AND pass = $2`, [user_email, user_pass]);
        
        // Retorna erro de Usuário não encontrado.
        if (!response) throw new Error(`Email ou Senha incorretos.`);

        // Gera o token base64
        const { id_user, email } = response;
        const timestamp = new Date().toISOString();
        const token = btoa(`${id_user} | ${email} | ${timestamp}`)

        // Gera hash seguro do token
        bcrypt.hash(token, 10, async function(err, hash)  {
            // Insere novo registro de Auth ou atualiza o já existente com o hash.
            await sql.none(`INSERT INTO auth (id_user, hash) VALUES ($1, $2) ON CONFLICT (id_user) DO UPDATE SET hash = EXCLUDED.hash, timestamp = CURRENT_TIMESTAMP`, [id_user, hash]);
        });

        // Retornar dados relevantes
        return { 
            login: true,
            id_user,
            token
        };

    } catch (loginError) {
        // Retorna o erro de login
        return {
            login: false,
            message: loginError.message
        }
    }
}

module.exports = { handleLogin }