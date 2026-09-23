import { Mongo } from "../dataBase/mongo.js"
import { ObjectId } from "mongodb"

const collectionName = "card"

export default class CardDataAccess {

    async getCard() {
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([
                {
                    $lookup: {
                        from: 'cardGifts',
                        localField: '_id',
                        foreignField: 'cardId',
                        as: 'gifts'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: '$gifts'
                },
                {
                    $lookup: {
                        from: 'gifts',
                        localField: 'gifts.giftId',
                        foreignField: '_id',
                        as: 'gifts.giftsDetails'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        userDetails: { $first: '$userDetails' },
                        gifts: { $push: '$gifts' },
                        pickupStatus: { $first: '$pickupStatus' },
                        pickupTime: { $first: '$pickupTime' }
                    }
                }
            ])
            .toArray()

        return result
    }

    async getCardByUserId(UserId) {
        console.log(UserId + " userID")
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([
                {
                    $match: { userId: new ObjectId(UserId) }
                },
                {
                    $lookup: {
                        from: 'cardGifts',
                        localField: '_id',
                        foreignField: 'cardId',
                        as: 'gifts'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: '$gifts'
                },
                {
                    $lookup: {
                        from: 'gifts',
                        localField: 'gifts.giftId',
                        foreignField: '_id',
                        as: 'gifts.giftsDetails'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        userDetails: { $first: '$userDetails' },
                        gifts: { $push: '$gifts' },
                        pickupStatus: { $first: '$pickupStatus' },
                        pickupTime: { $first: '$pickupTime' }
                    }
                }
            ])
            .toArray()

        return result
    }

    async addCard(cardData) {
        const { items, ...cardDataRest } = cardData;

        cardDataRest.createdAt = new Date();
        cardDataRest.pickupStatus = 'Pending';
        cardDataRest.userId = new ObjectId(cardDataRest.userId);

        const newCard = await Mongo.db
            .collection(collectionName)
            .insertOne(cardDataRest);

        if (!newCard.insertedId) {
            throw new Error('Erro ao criar o cartão de presentes');
        }

        const formattedItems = items.map((item) => ({
            quantity: item.quantity || 1,
            giftId: new ObjectId(item.giftId),
            cardId: new ObjectId(newCard.insertedId)
        }));

        const result = await Mongo.db
            .collection('cardGifts')
            .insertMany(formattedItems);

        // Opcional: Atualiza o estoque do presente diminuindo 1 unidade
        for (const item of items) {
            await Mongo.db.collection('gifts').updateOne(
                { _id: new ObjectId(item.giftId) },
                { $inc: { available: -(item.quantity || 1) } }
            );
        }

        return result;
    }
    async deleteCard(cardId) {
        const giftsToDelete = await Mongo.db
            .collection('cardGifts')
            .deleteMany({ cardId: new ObjectId(cardId) })

        const cardToDelete = await Mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(cardId) })

        return { giftsToDelete, cardToDelete }
    }

    async updateCard(cardId, cardData) {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(cardId) },
                { $set: cardData }
            )

        return result
    }
}