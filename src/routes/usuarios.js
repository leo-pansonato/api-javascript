const express = require('express');
const sql = require('../database/conexao');  // Importando a função sql

const router = express.Router();


// READ all
router.get('/', async (req, res) => {
  try {
    const users = await sql.any(`SELECT * FROM users`);
    res.json(users);
  } catch (e) {
    res.status(500).send(`Erro ao obter usuário. Erro: ${e}`);
  }
});

// READ by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await sql.one(`SELECT * FROM users WHERE id_user=$1`, [id]);
    res.json(user);
  } catch (e) {
    res.status(500).send(`Erro ao obter usuário. Erro: ${e}`);
  }
});

// CREATE
// router.post('/', async (req, res) => {
//   try {
//     const { name, email, tel, pass } = req.body;
//     await sql.none(`INSERT INTO users (name, email, tel) VALUES ($1, $2, $3, $4)`, [name, email, tel, pass]);
//     res.status(201).send('Usuário criado com sucesso.');
//   } catch (e) {
//     res.status(500).send(`Erro ao criar usuário. Erro: ${e}`);
//   }
// });

// UPDATE by ID
// router.put('/:id', async (req, res) => {
//   try {
//     const { name, email, tel, pass } = req.body;
//     const { id } = req.params;
//     await sql.none(`UPDATE users SET name=$1, email=$2, tel=$3, pass=$4 WHERE id_user=$5`, [name, email, tel, pass, id]);
//     res.status(200).send('Usuário alterado com sucesso.');
//   } catch (e) {
//     res.status(500).send(`Erro ao alterar usuário. Erro: ${e}`);
//   }
// });

// DELETE by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await sql.none(`DELETE FROM users WHERE id_user=$1`, [id]);
//     res.status(200).send('Usuário deletado com sucesso.');
//   } catch (e) {
//     res.status(500).send(`Erro ao deletar usuário. Erro: ${e}`);
//   }
// });

module.exports = router;