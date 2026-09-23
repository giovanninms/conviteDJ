import express from 'express'
import CardControllers from '../controllers/card.js'

const cardRouter = express.Router()
const cardControllers = new CardControllers()

cardRouter.get('/', async (req, res) => {
    const { success, statusCode, body } = await cardControllers.getCard()
    res.status(statusCode).send({ success, statusCode, body })
})

cardRouter.get('/usercarts/:id', async (req, res) => {
    const { success, statusCode, body } = await cardControllers.getCardByUserId(req.params.id)
    res.status(statusCode).send({ success, statusCode, body })
})

cardRouter.delete('/:id', async (req, res) => {
    console.log(req.params)
    const { success, statusCode, body } = await cardControllers.deleteCard(req.params.id)
    res.status(statusCode).send({ success, statusCode, body })
})

cardRouter.put('/:id', async (req, res) => {
    console.log(req.params)
    const { success, statusCode, body } = await cardControllers.updateCard(req.params.id, req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

cardRouter.post('/', async (req, res) => {
    console.log(req.body)
    const { success, statusCode, body } = await cardControllers.addCard(req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

cardRouter.post('/payment/checkout', async (req, res) => {
    try {
        const { success, statusCode, body } = await cardControllers.createCheckoutLink(req.body);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error("Erro no Checkout:", error);
        res.status(500).send({ success: false, statusCode: 500, body: error.message });
    }
});

cardRouter.post('/payment/webhook', async (req, res) => {
    try {
        await cardControllers.handleWebhook(req, res);
    } catch (error) {
        console.error("Erro no Webhook:", error);
        res.status(500).send({ success: false, statusCode: 500, body: error.message });
    }
});

export default cardRouter