import { Mongo } from "../dataBase/mongo.js"
import { ObjectId } from "mongodb"

const collectionName = "gifts"

export default class GiftsDataAccess {

    // Método auxiliar para garantir que a conexão com o MongoDB está ativa
    async getDb() {
        if (!Mongo.db) {
            await Mongo.connect();
        }
        return Mongo.db;
    }

    async getGifts() {
        const db = await this.getDb();
        const result = await db
            .collection(collectionName)
            .find({ isDeleted: { $ne: true } })
            .toArray();

        return result;
    }

    async getAvailableGifts() {
        const db = await this.getDb();
        const result = await db
            .collection(collectionName)
            .find({ 
                available: { $ne: 0 },
                isDeleted: { $ne: true }
            })
            .toArray();

        return result;
    }

    async addGift(giftData) {
        const db = await this.getDb();
        const result = await db
            .collection(collectionName)
            .insertOne({
                ...giftData,
                isDeleted: false
            });

        return result;
    }

    async deleteGift(giftId) {
        const db = await this.getDb();
        const result = await db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(giftId) },
                { $set: { isDeleted: true } },
                { returnDocument: 'after' }
            );

        return result;
    }

    async updateGift(giftId, giftData) {
        const db = await this.getDb();
        const result = await db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(giftId) },
                { $set: giftData },
                { returnDocument: 'after' }
            );

        return result;
    }
}