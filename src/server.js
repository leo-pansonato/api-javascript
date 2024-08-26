const express = require('express');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
try {
    app.use('/API/usuarios', usuariosRoutes);  // Usando as rotas de usuários
    app.use('/API/auth', authRoutes);  // Usando as rotas de autorização
} catch (error) {
    console.log(error)
}


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Rodando na porta http://localhost:${PORT}/API/`));