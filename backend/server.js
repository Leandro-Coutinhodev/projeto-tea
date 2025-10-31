import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite requests do frontend
app.use(express.json()); // Parse JSON bodies

// Rotas
app.use('/api/usuarios', usuarioRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'API funcionando!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});