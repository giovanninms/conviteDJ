import CardDataAccess from "../dataAccess/card.js"
import { ok, serverError } from "../helpers/httpResponse.js"

export default class CardControllers {
    constructor() {
        this.dataAccess = new CardDataAccess()
        this.handleWebhook = this.handleWebhook.bind(this)
        this.createCheckoutLink = this.createCheckoutLink.bind(this)
    }

    async getCard() {
        try {
            const result = await this.dataAccess.getCard()
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async getCardByUserId(UserId) {
        try {
            const result = await this.dataAccess.getCardByUserId(UserId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async deleteCard(cardId) {
        try {
            const result = await this.dataAccess.deleteCard(cardId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async addCard(cardData) {
        try {
            const result = await this.dataAccess.addCard(cardData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async updateCard(cardId, cardData) {
        try {
            const result = await this.dataAccess.updateCard(cardId, cardData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

async createCheckoutLink(reqData) {
    try {
        // Aceita tanto req.body direto quanto o objeto vindo da rota
        const bodyData = reqData.body || reqData;
        const { userId, giftId, giftName, price } = bodyData;

        let numericPrice = 0;
        if (typeof price === 'number') {
            numericPrice = price;
        } else if (typeof price === 'string') {
            numericPrice = parseFloat(price.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        }

        const priceInCents = Math.round(numericPrice * 100);

        if (isNaN(priceInCents) || priceInCents <= 0) {
            return {
                success: false,
                statusCode: 400,
                body: { error: "Valor do presente é inválido." }
            };
        }

        const orderNsu = `${userId || 'anonimo'}_${giftId || 'presente'}_${Date.now()}`;

        let frontendUrl = process.env.FRONTEND_URL || "https://convite-dj.vercel.app//cart";
        if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
            frontendUrl = `https://${frontendUrl}`;
        }

        const backendUrl = process.env.BACKEND_URL || "https://convite-dj.vercel.app/";
        const webhookUrl = `${backendUrl}/card/payment/webhook`;

        const response = await fetch("https://api.checkout.infinitepay.io/links", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                handle: "daniel-souza449",
                redirect_url: frontendUrl,
                webhook_url: webhookUrl,
                order_nsu: orderNsu,
                items: [{
                    quantity: 1,
                    price: priceInCents,
                    description: giftName || "Presente de Casamento"
                }]
            })
        });

        const data = await response.json();
        console.log("Resposta InfinitePay:", data);

        // DECLARAÇÃO EXPLÍCITA DA VARIÁVEL:
        const checkoutUrl = data?.url || data?.link_url;

        if (!response.ok || !checkoutUrl) {
            console.error("Erro retornado pela InfinitePay:", data);
            return {
                success: false,
                statusCode: response.status || 400,
                body: {
                    error: "A provedora de pagamento recusou a criação do checkout.",
                    details: data
                }
            };
        }

        // Retorna a URL tratada
        return {
            success: true,
            statusCode: 200,
            body: { url: checkoutUrl }
        };

    } catch (error) {
        console.error("Erro ao criar link de checkout:", error);
        return {
            success: false,
            statusCode: 500,
            body: { error: "Erro interno ao gerar cobrança." }
        };
    }
}

    async handleWebhook(req, res) {
        try {
            console.log("\n================ WEBHOOK RECEBIDO ================");
            console.log(JSON.stringify(req.body, null, 2));

            // Garante leitura de sub-objetos com fallback
            const body = req.body || {};
            const data = body.data || body;

            // Mapeamento flexível das propriedades enviadas pela InfinitePay
            const orderNsu = data.order_nsu || body.order_nsu;
            const paidAmount = data.paid_amount || data.amount || body.paid_amount;
            const transactionNsu = data.transaction_nsu || data.id || body.transaction_nsu;
            const status = (data.status || body.status || '').toLowerCase();

            // O pagamento é aprovado se o status for 'paid'/'approved' ou se houver confirmação de valor/transação
            const isApproved = status === 'paid' || status === 'approved' || (paidAmount && paidAmount > 0) || Boolean(transactionNsu);

            console.log(`Verificação: status=${status} | paidAmount=${paidAmount} | orderNsu=${orderNsu} | Aprovado=${isApproved}`);

            if (isApproved && orderNsu) {
                const parts = orderNsu.split('_');
                const userId = parts[0];
                const giftId = parts[1];

                const cardData = {
                    userId: userId,
                    pickupTime: new Date().toLocaleDateString('pt-BR'),
                    items: [
                        {
                            giftId: giftId,
                            quantity: 1
                        }
                    ]
                };

                console.log("--> Tentando cadastrar no MongoDB via addCard:", cardData);
                const insertResult = await this.dataAccess.addCard(cardData);
                console.log("--> Sucesso! Registrado no MongoDB:", insertResult);
            } else {
                console.log("⚠️ Webhook ignorado: Pagamento não confirmado ou order_nsu ausente.");
            }

            // Sempre responder 200 para a InfinitePay saber que a notificação foi entregue
            return res.status(200).send("OK");
        } catch (error) {
            console.error("❌ ERRO GRAVE NO WEBHOOK:", error);
            return res.status(500).send("Erro interno ao processar webhook");
        }
    }
}