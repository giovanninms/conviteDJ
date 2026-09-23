import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { LuHeart } from "react-icons/lu";
import styles from './page.module.css';
import AuthServices from "../../services/auth";
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [telefone, setTelefone] = useState("");
    const [formType, setFormType] = useState('login');
    const [formData, setFormData] = useState({});
    const { login, signup, authLoanding } = AuthServices();
    const navigate = useNavigate();
    const authData = JSON.parse(localStorage.getItem('auth'));

    useEffect(() => {
        if (authData?.user) {
            const isAdmin = authData.user.isAdmin === true || authData.user.role === 'admin';
            
            if (isAdmin) {
                navigate('/gifts'); // Casal vai para a lista/gestão de presentes
            } else {
                navigate('/cart'); // Convidado vai para o carrinho/meus presentes
            }
        }
    }, [authData, navigate]);

    const handlePhoneChange = (event) => {
        let value = event.target.value;

        // Remove tudo que não for número
        value = value.replace(/\D/g, "");

        // Aplica a formatação de DDD e hífen
        if (value.length <= 10) {
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
            value = value.replace(/(\d{4})(\d)/, "$1-$2");
        } else {
            value = value.slice(0, 11);
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
            value = value.replace(/(\d{5})(\d)/, "$1-$2");
        }

        setTelefone(value);

        setFormData((prev) => ({
            ...prev,
            [event.target.name]: value
        }));
    };

    const handleFormType = () => {
        setFormData({});
        setTelefone("");
        setFormType((prev) => (prev === 'login' ? 'signup' : 'login'));
    };

    const handleFormDataChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (formType === 'login') {
            login(formData);
        } else {
            signup(formData);
        }
    };

    // Estilo personalizado para os inputs do Material UI para combinar com o tema
    const inputStyleProps = {
        sx: {
            '& label.Mui-focused': { color: '#8B3568' },
            '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': { borderColor: '#8B3568' },
                '&.Mui-focused fieldset': { borderColor: '#8B3568' },
            },
        }
    };

    if (authLoanding) {
        return <h1 className={styles.loadingText}>Carregando...</h1>;
    }

    return (
        <div className={styles.bodyContainer}>
            {/* Título Elegante */}
            <h1 className={styles.title}>
                {formType === 'login' ? 'Entrar' : 'Cadastro'}
            </h1>
            <p className={styles.subTitle}>
                {formType === 'login' 
                    ? 'ACESSE SUA CONTA PARA CONTINUAR' 
                    : 'FAÇA SEU CADASTRO PARA PRESENTEAR'}
            </p>

            {/* Divisor com Coração */}
            <div className={styles.lineHeart}>
                <div className={styles.line}></div>
                <span className={styles.hearImg}><LuHeart /></span>
                <div className={styles.line}></div>
            </div>

            {/* Container do Formulário */}
            <div className={styles.giftListContainer}>
                <div className={styles.giftCard}>
                    <form className={styles.formContainer} onSubmit={handleSubmitForm}>
                        
                        {formType === 'signup' && (
                            <TextField
                                required
                                fullWidth
                                className={styles.inputForm}
                                type="text"
                                label="NOME COMPLETO"
                                name="name"
                                value={formData?.name || ''}
                                onChange={handleFormDataChange}
                                {...inputStyleProps}
                            />
                        )}

                        <TextField
                            required
                            fullWidth
                            className={styles.inputForm}
                            type="text"
                            label="TELEFONE"
                            name="phone"
                            value={telefone}
                            onChange={handlePhoneChange}
                            placeholder="(00) 00000-0000"
                            slotProps={{ htmlInput: { maxLength: 15 } }}
                            {...inputStyleProps}
                        />

                        <TextField
                            required
                            fullWidth
                            className={styles.inputForm}
                            label="DATA DE NASCIMENTO"
                            type="date"
                            name="dateBirth"
                            value={formData?.dateBirth || ''}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleFormDataChange}
                            {...inputStyleProps}
                        />

                        {/* Botão de Envio */}
                        <div className={styles.actionsContainer} style={{ width: '100%', marginTop: '10px' }}>
                            <button type="submit" className={styles.button}>
                                {formType === 'login' ? 'PRESENTEAR' : 'PRESENTEAR'}
                            </button>
                        </div>
                    </form>

                    <div className={styles.lineDivider}></div>

                    {/* Botão para alternar entre Login e Cadastro */}
                    <button 
                        type="button" 
                        className={styles.toggleButton} 
                        onClick={handleFormType}
                    >
                        {formType === 'login' 
                            ? 'Ainda não tem cadastro? Clique aqui' 
                            : 'Já possui cadastro? Clique para entrar'}
                    </button>
                </div>
            </div>
        </div>
    );
}