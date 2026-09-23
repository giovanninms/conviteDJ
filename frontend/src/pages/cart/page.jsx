import { useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import CartServices from "../../services/cart";
import styles from './page.module.css';
import { LuHeart } from "react-icons/lu";

export default function Cart() {
    const [searchParams] = useSearchParams();

    // Captura as informações enviadas na URL após retorno do checkout
    const captureMethod = searchParams.get('capture_method');
    const receiptUrl = searchParams.get('receipt_url');

    if (captureMethod) console.log("Método utilizado:", captureMethod);
    if (receiptUrl) console.log("Link do recibo:", receiptUrl);

    const navigate = useNavigate();
    const authData = JSON.parse(localStorage.getItem('auth'));

    const { getUserCart, cartLoading, cartList } = CartServices();

    useEffect(() => {
        if (!authData) {
            navigate('/auth');
        } else {
            getUserCart(authData?.user?._id);
        }
    }, [authData?.user?._id]);

    if (cartLoading) {
        return <h1 className={styles.loadingText}>Carregando seus presentes...</h1>;
    }

    return (
        <div className={styles.bodyContainer}>
            {/* Título Principal */}
            <h1 className={styles.title}>Meus Presentes</h1>
            <p className={styles.subTitle}>OBRIGADO POR FAZER PARTE DESSE MOMENTO!</p>

            <br />

            {/* Botão para voltar à Lista */}
            <div className={styles.actionsContainer}>
                <button
                    className={styles.button}
                    onClick={() => navigate('/gifts')}
                >
                    VOLTAR À LISTA
                </button>
            </div>

            {/* Divisor com Coração */}
            <div className={styles.lineHeart}>
                <div className={styles.line}></div>
                <span className={styles.hearImg}><LuHeart /></span>
                <div className={styles.line}></div>
            </div>

            {/* Dados do Usuário */}
            {authData?.user && (
                <div className={styles.userInfoCard}>
                    <p className={styles.userName}>{authData.user.name}</p>
                    {authData.user.phone && <p className={styles.text}><strong>Telefone:</strong> {authData.user.phone}</p>}
                </div>
            )}

            {/* Lista de Cartões / Presentes Dados */}
            <div className={styles.giftListContainer}>
                {Array.isArray(cartList) && cartList.length > 0 ? (
                    cartList.map((card) => (
                        <div key={card._id} className={styles.giftCard}>
                            <p className={styles.dateText}>
                                <strong>Data de compra:</strong> {card.pickupTime}
                            </p>

                            <div className={styles.lineDivider}></div>

                            {card.gifts && card.gifts.map((item, index) => (
                                <div key={item._id || index} className={styles.giftDetails}>
                                    <h2 className={styles.giftTitle}>
                                        {item.giftsDetails?.[0]?.name || "Presente"}
                                    </h2>
                                    <p className={styles.text}>
                                        <strong>Valor:</strong> {item.giftsDetails?.[0]?.price || "N/A"}
                                    </p>
                                    <p className={styles.text}>
                                        <strong>Quantidade:</strong> {item.quantity || 1}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyContainer}>
                        <p className={styles.subTitle}>Você ainda não presenteou!</p>
                        <p className={styles.text}>Escolha um presente especial para demonstrar seu carinho.</p>
                    </div>
                )}
            </div>
        </div>
    );
}