import { Mongo } from "../dataBase/mongo.js"
import { ObjectId } from "mongodb"
import crypto from "crypto"

const collectionName = "users"

export default class UsersDataAccess {
    async getUsers() { //Retorna todos os usuários cadastrados no banco de dados
        const result = await Mongo.db
            .collection(collectionName)
            .find({})
            .toArray()

        return result
    }

    async deleteUser(userId) { //Deleta um usuário do banco de dados 
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(userId) })

        return result
    }

    // ✅ CORREÇÃO em dataAccess/users.js
    async updateUser(userId, userData) {
        if (userData.password) {
            const salt = crypto.randomBytes(16);
            const hashedPassWord = crypto.pbkdf2Sync(
                userData.password,
                salt,
                310000,
                16,
                'sha256'
            );

            userData = {
                ...userData,
                password: hashedPassWord.toString('hex'),
                salt: salt.toString('hex')
            };
        }

        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: userData },
                { returnDocument: 'after' }
            );

        return result;
    }
}

