import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import GiftServices from "../../services/gift";
import styles from './page.module.css';
import { LuHeart, LuX, LuTrash2 } from "react-icons/lu";

export default function Gift() {
    const navigate = useNavigate();
    // 1. Incluído 'deleteGift' dos serviços
    const { giftLoading, giftList, getGift, addGift, updateGift, deleteGift, checkoutGift } = GiftServices();
    const authData = JSON.parse(localStorage.getItem('auth'));
    const isAdmin = authData?.user?.isAdmin === true || authData?.user?.role === 'admin';

    const [loadingPaymentId, setLoadingPaymentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: "", image: "", available: 1 });

    useEffect(() => {
        getGift();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("Escolha uma imagem de até 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleOpenAddModal = () => {
        setSelectedGift(null);
        setFormData({ name: "", price: "", image: "", available: 1 });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (gift) => {
        setSelectedGift(gift);
        setFormData({
            name: gift.name || "",
            price: gift.price || "",
            image: gift.image || "",
            available: gift.available ?? 1
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        name: formData.name,
        price: Number(formData.price),
        image: formData.image,
        available: Number(formData.available)
    };

    let success = false;
    if (selectedGift) {
        success = await updateGift(selectedGift._id, payload);
    } else {
        success = await addGift(payload);
    }

    if (success) {
        setIsModalOpen(false);
        await getGift(); // Recarrega a lista do banco atualizada
    } else {
        alert("Ocorreu um erro ao salvar o presente.");
    }
};

const handleDelete = async () => {
    if (!selectedGift?._id) return;

    if (window.confirm(`Tem certeza que deseja excluir o presente "${selectedGift.name}"?`)) {
        const res = await deleteGift(selectedGift._id);
        if (res) {
            setIsModalOpen(false);
            await getGift(); // Recarrega a lista
        }
    }
};

    const handleCheckout = async (gift) => {
        setLoadingPaymentId(gift._id);

        try {
            // Envia o objeto gift diretamente para a service tratar
            const result = await checkoutGift(gift);

            // Extrai a URL do padrão retornado pelo seu Backend ({ body: { url } })
            const checkoutUrl = result?.body?.url || result?.url;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                console.error("Link de checkout não encontrado na resposta:", result);
            }
        } catch (error) {
            console.error("Erro no redirecionamento:", error);
            alert("Ocorreu um erro ao conectar com o serviço de pagamento.");
        } finally {
            setLoadingPaymentId(null);
        }
    };

    if (giftLoading && !isModalOpen) {
        return <h1 className={styles.loadingText}>Carregando presentes...</h1>;
    }

    return (
        <div className={styles.bodyContainer}>
            <h1 className={styles.title}>Lista de Presentes</h1>
            <p className={styles.subTitle}>
                {isAdmin ? "GERENCIE OS PRESENTES DO CASAMENTO" : "DEIXE SEU CARINHO EM FORMA DE PRESENTE!"}
            </p>

            <br />

            <div className={styles.actionsContainer}>
                {isAdmin ? (
                    <button className={styles.button} onClick={handleOpenAddModal}>
                        + ADICIONAR PRESENTE
                    </button>
                ) : (
                    <button className={styles.button} onClick={() => navigate('/cart')}>
                        MEUS PRESENTES
                    </button>
                )}
            </div>

            <div className={styles.lineHeart}>
                <div className={styles.line}></div>
                <span className={styles.hearImg}><LuHeart /></span>
                <div className={styles.line}></div>
            </div>

            <div className={styles.giftListContainer}>
                {Array.isArray(giftList) && giftList.length > 0 ? (
                    giftList.map((gift) => (
                        <div key={gift._id} className={styles.giftCard}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={gift.image || "https://via.placeholder.com/200?text=Sem+Foto"}
                                    alt={gift.name}
                                    className={styles.giftImage}
                                />
                            </div>

                            <h2 className={styles.giftTitle}>{gift.name}</h2>

                            <div className={styles.giftDetails}>
                                <p className={styles.text}>
                                    <strong>Valor:</strong> R$ {Number(gift.price).toFixed(2)}
                                </p>
                                <p className={styles.text}>
                                    <strong>Disponíveis:</strong> {gift.available}
                                </p>
                            </div>

                            <div className={styles.actionsContainer}>
                                {isAdmin ? (
                                    <button className={styles.button} onClick={() => handleOpenEditModal(gift)}>
                                        EDITAR PRESENTE
                                    </button>
                                ) : (
                                    <button
                                        className={styles.button}
                                        disabled={loadingPaymentId === gift._id || gift.available <= 0}
                                        onClick={() => handleCheckout(gift)}
                                    >
                                        {loadingPaymentId === gift._id
                                            ? "Aguarde..."
                                            : gift.available <= 0
                                                ? "Esgotado"
                                                : "Presentear"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) :  (
                    <p className={styles.text}>Nenhum presente disponível no momento.</p>
                )}
            </div>

            {/* MODAL ADICIONAR / EDITAR / EXCLUIR */}
            {isModalOpen && isAdmin && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>{selectedGift ? "Editar Presente" : "Adicionar Presente"}</h2>
                            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                                <LuX />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.modalForm}>
                            <label className={styles.label}>
                                Nome do Presente:
                                <input
                                    type="text"
                                    required
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </label>

                            <label className={styles.label}>
                                Preço (R$):
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className={styles.input}
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </label>

                            <label className={styles.label}>
                                Foto do Presente:
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={handleImageUpload}
                                />
                            </label>

                            {formData.image && (
                                <div className={styles.previewContainer}>
                                    <img src={formData.image} alt="Pré-visualização" className={styles.previewImage} />
                                </div>
                            )}

                            <label className={styles.label}>
                                Quantidade Disponível:
                                <input
                                    type="number"
                                    required
                                    className={styles.input}
                                    value={formData.available}
                                    onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                                />
                            </label>

                            <div className={styles.modalActions}>
                                {/* 3. Botão Excluir (Só aparece se for EDIÇÃO) */}
                                {selectedGift && (
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={handleDelete}
                                    >
                                        <LuTrash2 style={{ marginRight: '6px' }} /> EXCLUIR
                                    </button>
                                )}

                                <button type="submit" className={styles.button}>
                                    SALVAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}