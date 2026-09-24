import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";


export default function GiftServices() {
    const [giftLoading, setGiftLoading] = useState(false);
    const [refectGifts, setRefectGifts] = useState(true);
    const [giftList, setGiftList] = useState([]);
    const navigate = useNavigate();

    // Obtém os dados do usuário do localStorage
    const authData = JSON.parse(localStorage.getItem('auth'));

    // Verifica se o usuário logado é o casal/admin
    const isAdmin = authData?.user?.isAdmin === true || authData?.user?.role === 'admin';

    const url = 'https://convite-dj.vercel.app/gifts';
    
    const getGift = useCallback(async () => {
    setGiftLoading(true);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json'
                // Removido o 'Access-Control-Allow-Origin' que estava aqui
            },
        });

        const result = await response.json();

        // 💡 NOVA VERIFICAÇÃO FLEXÍVEL:
        // Checa se result é um Array direto OU se está dentro de result.body
        if (Array.isArray(result)) {
            setGiftList(result);
        } else if (result && result.success && Array.isArray(result.body)) {
            setGiftList(result.body);
        } else {
            console.warn("Formato de resposta não reconhecido:", result);
            setGiftList([]);
        }
    } catch (error) {
        console.error("Erro ao buscar presentes:", error);
        setGiftList([]);
    } finally {
        setGiftLoading(false);
    }
}, [url]);

    const addGift = async (giftData) => {
    setGiftLoading(true);
    try {
        const authData = JSON.parse(localStorage.getItem('auth'));
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData?.token}` 
            },
            body: JSON.stringify(giftData)
        });
        const result = await response.json();
        return response.ok || result.success;
    } catch (error) {
        console.error("Erro ao adicionar presente:", error);
        return false;
    } finally {
        setGiftLoading(false);
    }
};

const updateGift = async (giftId, giftData) => {
    setGiftLoading(true);
    try {
        const authData = JSON.parse(localStorage.getItem('auth'));
        
        // Garante que o _id não vá dentro do corpo para não dar conflito no Mongo
        const { _id, ...cleanData } = giftData;

        const response = await fetch(`${url}/${giftId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData?.token}` 
            },
            body: JSON.stringify(cleanData)
        });

        if (!response.ok) {
            // Se der erro 500/400, lê como texto para não quebrar no JSON parse
            const errorText = await response.text();
            console.error(`Erro ${response.status} do servidor:`, errorText);
            return false;
        }

        const result = await response.json();
        return result.success ?? true;
    } catch (error) {
        console.error("Erro ao atualizar presente:", error);
        return false;
    } finally {
        setGiftLoading(false);
    }
};

    const deleteGift = async (id) => {
        setGiftLoading(true);
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData?.token}` // Envia o token caso o backend exija autenticação
                }
            });

            const result = await response.json();

            if (response.ok || result.success) {
                alert("Presente excluído com sucesso!");
                return result;
            } else {
                alert(result.message || "Erro ao excluir o presente.");
            }
        } catch (error) {
            console.error("Erro ao deletar presente:", error);
            alert("Erro de conexão ao tentar excluir o presente.");
        } finally {
            setGiftLoading(false);
        }
    };

    const checkoutGift = async (gift) => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const userId = authData?.user?._id || authData?.user?.id;

            if (!userId) {
                navigate('/auth');
                return null;
            }

            // Suporta tanto receber o objeto 'gift' direto quanto o 'payload' pronto do componente
            const giftId = gift._id || gift.giftId;
            const giftName = gift.name || gift.giftName;
            const giftPrice = gift.price;

            const response = await fetch('https://convite-dj.vercel.app/card/payment/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData?.token}`
                },
                body: JSON.stringify({
                    userId: userId,
                    giftId: giftId,
                    giftName: giftName,
                    price: giftPrice
                })
            });

            const data = await response.json();
            console.log("Resposta recebida no checkoutGift:", data);

            // O backend envia { body: { url: "..." } } ou direto { url: "..." }
            return data;
        } catch (error) {
            console.error("Erro ao gerar link de presente:", error);
            alert("Erro ao processar o pagamento.");
            return null;
        }
    };

    // Lembre-se de incluir 'checkoutGift' no return do hook:
    return { giftLoading, refectGifts, giftList, getGift, addGift, updateGift, deleteGift, checkoutGift };

}