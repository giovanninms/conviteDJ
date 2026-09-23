import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import { Mongo } from '../dataBase/mongo.js'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

const collectionName = 'users'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Estratégia do Passport
passport.use(new LocalStrategy(
    { usernameField: 'phone', passwordField: 'dateBirth', passReqToCallback: true }, 
    async (req, phone, _, callback) => {
        try {
            const user = await Mongo.db
                .collection(collectionName)
                .findOne({ phone: phone })

            if (!user) {
                return callback(null, false, { message: 'Usuário não encontrado.' })
            }
            return callback(null, user)
        } catch (error) {
            return callback(error)
        }
    }
))

const authRouter = express.Router()

// ROTA DE CADASTRO (SIGNUP) CORRIGIDA
authRouter.post('/signup', async (req, res) => {
    try {
        // 1. Verifica se o usuário já existe
        const checkUser = await Mongo.db
            .collection(collectionName)
            .findOne({ phone: req.body.phone })

        if (checkUser) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                body: { text: 'Usuário já cadastrado!' }
            })
        }

        // 2. Insere o novo usuário
        const result = await Mongo.db
            .collection(collectionName)
            .insertOne({
                name: req.body.name,
                phone: req.body.phone,
                dateBirth: req.body.dateBirth
            })

        // 3. Se inseriu com sucesso, busca o usuário criado e gera o JWT
        if (result.insertedId) {
            const user = await Mongo.db
                .collection(collectionName)
                .findOne({ _id: new ObjectId(result.insertedId) })

            const token = jwt.sign({ _id: user._id, phone: user.phone }, JWT_SECRET)

            return res.status(201).send({ 
                success: true, 
                statusCode: 201,
                body: {
                    text: 'Usuário registrado com sucesso!',
                    token,
                    user,
                    logged: true
                }
            })
        }

        // Fallback caso a inserção falhe por algum motivo
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: { text: 'Erro ao criar usuário.' }
        })

    } catch (error) {
        console.error("Erro no signup:", error)
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: { text: 'Erro interno no servidor.', error: error.message }
        })
    }
})

// ROTA DE LOGIN
authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (error, user) => {
        if (error) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Erro ao autenticar usuário!',
                    error
                }
            })
        }

        if (!user) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                body: {
                    text: 'Credenciais incorretas!'
                }
            })
        }

        const token = jwt.sign({ _id: user._id, phone: user.phone }, JWT_SECRET)

        return res.status(200).send({
            success: true,
            statusCode: 200,
            body: {
                text: 'Usuário conectado corretamente!',
                user,
                token
            }
        })
    })(req, res)
})

export default authRouter