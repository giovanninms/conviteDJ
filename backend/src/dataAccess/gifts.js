import { Mongo } from "../dataBase/mongo.js"
import { ObjectId } from "mongodb"

const collectionName = "gifts"

export default class GiftsDataAccess {

    async getGifts() {
        // Garante a conexão caso o banco não esteja inicializado
        if (!Mongo.db) {
            await Mongo.connect();
        }

        // Se a sua classe Mongo armazena o client do mongodb em 'client' ou 'db', ajuste para .db():
        const dbInstance = typeof Mongo.db === 'function' ? Mongo.db() : Mongo.db;

        const result = await dbInstance
            .collection(collectionName)
            .find({ isDeleted: { $ne: true } })
            .toArray();

        return result;
    }

    async getAvailableGifts() {
        if (!Mongo.db) {
            await Mongo.connect();
        }

        const dbInstance = typeof Mongo.db === 'function' ? Mongo.db() : Mongo.db;

        const result = await dbInstance
            .collection(collectionName)
            .find({ 
                available: { $ne: 0 },
                isDeleted: { $ne: true }
            })
            .toArray();

        return result;
    }

    async addGift(giftData) {
        const dbInstance = typeof Mongo.db === 'function' ? Mongo.db() : Mongo.db;

        const result = await dbInstance
            .collection(collectionName)
            .insertOne({
                ...giftData,
                isDeleted: false
            });

        return result;
    }

    async deleteGift(giftId) {
        const dbInstance = typeof Mongo.db === 'function' ? Mongo.db() : Mongo.db;

        const result = await dbInstance
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(giftId) },
                { $set: { isDeleted: true } },
                { returnDocument: 'after' }
            );

        return result;
    }

    async updateGift(giftId, giftData) {
    try {
        const db = await this.getDb();
        
        // Remove _id se tiver sido enviado no body por engano
        delete giftData._id;

        const result = await db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(giftId) },
                { $set: giftData },
                { returnDocument: 'after' }
            );

        return result;
    } catch (error) {
        console.error("Erro no updateGift DataAccess:", error);
        throw error;
    }
}
}