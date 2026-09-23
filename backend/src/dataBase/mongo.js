import { MongoClient } from 'mongodb';

export const Mongo = {
    db: null,
    client: null,
    asyncConnectPromise: null,

    async connect({ mongoConnectString, mongoDbName } = {}) {
        const connectionString = mongoConnectString || process.env.MONGO_CS;
        const dbName = mongoDbName || process.env.MONGO_DB_NAME;

        if (!connectionString || !dbName) {
            console.error("❌ ERRO: MONGO_CS ou MONGO_DB_NAME não foram definidos nas variáveis de ambiente!");
            throw new Error("Variáveis de ambiente do MongoDB não encontradas.");
        }

        if (this.db) {
            return this.db;
        }

        // Se já houver uma tentativa de conexão em andamento, aguarda ela terminar
        if (this.asyncConnectPromise) {
            return await this.asyncConnectPromise;
        }

        this.asyncConnectPromise = (async () => {
            try {
                console.log("🔄 Conectando ao MongoDB Atlas...");
                const client = new MongoClient(connectionString);
                await client.connect();
                
                this.client = client;
                this.db = client.db(dbName);

                console.log(`✅ MongoDB conectado com sucesso no banco: ${dbName}`);
                return this.db;
            } catch (error) {
                console.error("❌ Falha na conexão com o MongoDB:", error.message);
                this.client = null;
                this.db = null;
                this.asyncConnectPromise = null;
                throw error;
            }
        })();

        return await this.asyncConnectPromise;
    }
};