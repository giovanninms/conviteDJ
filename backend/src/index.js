import crypto from 'node:crypto';
if (!globalThis.crypto) { globalThis.crypto = crypto; }
import express from 'express';
import cors from 'cors';
import { Mongo } from './dataBase/mongo.js';
import { config } from 'dotenv';
import authRouter from './auth/auth.js';
import usersRouter from './routers/users.js';
import giftsRouter from './routers/gifts.js';
import cardRouter from './routers/card.js';

config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Middleware para garantir conexão com o MongoDB a cada requisição
app.use(async (req, res, next) => {
    try {
        await Mongo.connect({
            mongoConnectString: process.env.MONGO_CS,
            mongoDbName: process.env.MONGO_DB_NAME
        });
        next();
    } catch (err) {
        console.error("⚠️ Erro na conexão do banco durante a requisição:", err.message);
        return res.status(500).json({ error: "Erro na conexão com o banco de dados." });
    }
});

// Rota de Health Check
app.get('/', (req, res) => {
    return res.status(200).json({
        status: "OK",
        message: "🚀 API rodando com sucesso na Vercel!"
    });
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/gifts', giftsRouter);
app.use('/card', cardRouter);

// Apenas roda o server local se NÃO estiver em produção na Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const port = process.env.PORT || 3030;
    app.listen(port, () => {
        console.log(`🚀 Servidor rodando localmente na porta ${port}`);
    });
}

// EXPORTANTE: A Vercel precisa da exportação padrão da aplicação Express
export default app;