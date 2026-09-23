import { MongoClient } from 'mongodb';

// Armazena a conexão globalmente para ser reaproveitada nas chamadas Serverless
let cachedClient = global._mongoClient;
let cachedDb = global._mongoDb;

export const Mongo = {
    async connect({ mongoConnectString, mongoDbName } = {}) {
        const connectionString = mongoConnectString || process.env.MONGO_CS;
        const dbName = mongoDbName || process.env.MONGO_DB_NAME;

        if (!connectionString || !dbName) {
            console.error("❌ ERRO: MONGO_CS ou MONGO_DB_NAME não foram definidos nas variáveis de ambiente!");
            throw new Error("Variáveis de ambiente do MongoDB não encontradas.");
        }

        // Se já existe conexão reaproveitável, retorna o banco direto
        if (cachedDb) {
            return cachedDb;
        }

        try {
            console.log("🔄 Conectando ao MongoDB Atlas...");
            if (!cachedClient) {
                cachedClient = new MongoClient(connectionString);
                await cachedClient.connect();
                global._mongoClient = cachedClient;
            }

            cachedDb = cachedClient.db(dbName);
            global._mongoDb = cachedDb;

            console.log(`✅ MongoDB conectado com sucesso no banco: ${dbName}`);
            return cachedDb;
        } catch (error) {
            console.error("❌ Falha na conexão com o MongoDB:", error.message);
            throw error;
        }
    }
};