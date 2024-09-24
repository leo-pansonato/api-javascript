require('dotenv').config();

const bcrypt = require('bcrypt');
const sql = require('../database/conexao');


/**
 * @param user_email O email que será utilizado.
 * @param user_pass A senha que será utilizada para o login.
 * @return Retorna `id_user` e `token` ou menssagem de erro.
 */
async function handleLogin (user_email, user_pass) {
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

/**
 * @param user_name O Nome que sera vinculado ao cadastro.
 * @param user_email O Email que sera vinculado ao cadastro.
 * @param user_tel O Telefone que sera vinculado ao cadastro.
 * @param user_pass A senha que será utilizada para o cadastro.
 * @return Retorna `id_user` e `token` ou menssagem de erro.
 */
async function handleSignin(user_name, user_email, user_tel, user_pass) {
    try {
        // Procura pelo usuário com email e senha
        const response = await sql.oneOrNone(`SELECT id_user, email FROM users WHERE email = $1`, [user_email]);
        
        // Retorna erro de Usuário não encontrado.
        if (response) throw new Error(`Email já cadastrado.`);

        // Insere novo usuário
        const user = await sql.one(`
            INSERT INTO users (name, email, tel, pass)
            VALUES($1, $2, $3, $4);

            SELECT id_user
            FROM users
            WHERE email = $5 AND pass = $6;
        `,[user_name, user_email, user_tel, user_pass, user_email, user_pass]);
        
        // Verifica se usuário foi inserido corretamente
        if(!user) throw new Error(`Erro ao cadastrar usuário, tente novamente mais tarde.`);

        // Loga o usuário e retorna os dados relevantes
        return await handleLogin(user_email, user_pass);
        
    } catch (signInError) {
        // Retorna o erro de signIn
        return {
            signIn: false,
            message: signInError.message
        }
    }
}

async function handleVerifyAuth (id_user, token) {
    try {
        // Procura pelo usuário com email e senha
        const response = await sql.oneOrNone(`SELECT id_user, hash FROM auth WHERE id_user = $1`, [id_user]);
        const { hash } = response;

        const result = await bcrypt.compare(token, hash);

        return {autorizado: result};

    } catch (authVerifyError) {
        return {autorizado: false};
    }
}

module.exports = { handleLogin, handleSignin, handleVerifyAuth }