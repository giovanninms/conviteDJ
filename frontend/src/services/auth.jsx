import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthServices() {
    const [authLoanding, setAuthLoanding] = useState(false);
    const navigate = useNavigate();
    const url = 'https://convite-dj.vercel.app/auth';

    // Função de Redirecionamento Centralizada
    const handleNavigationAfterAuth = (user) => {
        const isAdmin = user?.isAdmin === true || user?.role === 'admin';
        
        if (isAdmin) {
            navigate('/gifts'); // Ajuste aqui para a sua rota de presentes (ex: '/gifts' ou '/gift')
        } else {
            navigate('/cart');
        }
    };

    const login = (formData) => {
        setAuthLoanding(true);
        fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success && result.body.token) {
                    // Salva os dados no localStorage
                    localStorage.setItem(
                        'auth',
                        JSON.stringify({ token: result.body.token, user: result.body.user })
                    );

                    // Redireciona dependendo de quem logou
                    handleNavigationAfterAuth(result.body.user);
                } else {
                    alert(result.message || "Erro ao realizar login. Verifique seus dados.");
                }
                console.log(result);
            })
            .catch((error) => {
                console.error("Erro no login:", error);
                alert("Erro de conexão ao tentar fazer login.");
            })
            .finally(() => {
                setAuthLoanding(false);
            });
    };

    const signup = (formData) => {
        setAuthLoanding(true);
        fetch(`${url}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success && result.body.token) {
                    // Salva no localStorage no mesmo formato do login
                    localStorage.setItem(
                        'auth',
                        JSON.stringify({ token: result.body.token, user: result.body.user })
                    );

                    // Redireciona dependendo de quem se cadastrou
                    handleNavigationAfterAuth(result.body.user);
                } else {
                    alert(result.message || "Erro ao realizar cadastro.");
                }
                console.log(result);
            })
            .catch((error) => {
                console.error("Erro no cadastro:", error);
                alert("Erro de conexão ao tentar se cadastrar.");
            })
            .finally(() => {
                setAuthLoanding(false);
            });
    };

    return { signup, login, authLoanding };
}