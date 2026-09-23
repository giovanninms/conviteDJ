import express from 'express'
import GiftsControllers from '../controllers/gifts.js'

const giftsRouter = express.Router()
const giftsControllers = new GiftsControllers()

giftsRouter.get('/', async (req, res) => {
    try {
        const response = await giftsControllers.getGifts();
        const status = response?.statusCode || 200;
        return res.status(status).json(response);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
})

giftsRouter.get('/available', async (req, res) => {
    // ⚠️ Se no controller for getAvailableGifts ou getGiftsAvailable, garanta o nome correto
    const { success, statusCode, body } = await giftsControllers.getGiftsAvailable()
    res.status(statusCode).send({ success, statusCode, body })
})

// 🔴 CORREÇÃO AQUI: Trocar deleteGifts por deleteGift (no singular)
giftsRouter.delete('/:id', async (req, res) => {
    try {
        console.log(req.params)
        const { success, statusCode, body } = await giftsControllers.deleteGift(req.params.id)
        res.status(statusCode || 200).send({ success, statusCode, body })
    } catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
})

// 🔴 CORREÇÃO AQUI: Trocar updateGifts por updateGift (no singular)
giftsRouter.put('/:id', async (req, res) => {
    try {
        console.log(req.params)
        const { success, statusCode, body } = await giftsControllers.updateGift(req.params.id, req.body)
        res.status(statusCode || 200).send({ success, statusCode, body })
    } catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
})

// 🔴 CORREÇÃO AQUI: Trocar addGifts por addGift (no singular)
giftsRouter.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const { success, statusCode, body } = await giftsControllers.addGift(req.body)
        res.status(statusCode || 201).send({ success, statusCode, body })
    } catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
})

export default giftsRouter