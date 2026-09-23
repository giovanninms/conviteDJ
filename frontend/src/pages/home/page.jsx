import styles from './page.module.css';
import { LuHeart, LuStar } from "react-icons/lu";

export default function Home() {
    const whatsappNumber = "5543996829928";
    const defaultMessage = "Olá! Passando para confirmar minha presença no seu casamento! ✨❤️";

    const handleConfirmPresence = () => {
        const encodedText = encodeURIComponent(defaultMessage);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className={styles.bodyContainer}>

            {/* Versículo formatado no estilo bíblico com a citação à direita */}
            <blockquote className={styles.verseContainer}>
                <p className={styles.verseText}>
                    “Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.”
                </p>
                <cite className={styles.verseCite}>
                    1 Coríntios 13:13
                </cite>
            </blockquote>

            {/* 2. NOIVOS NO CENTRO */}
            <h1 className={styles.title}>Jhennyfer e Daniel</h1>
            <br />
            {/* 1. SEÇÃO DOS PAIS */}
            <h2 className={styles.subTitle}>COM A BÊNÇÃO DE DEUS E DE NOSSOS PAIS</h2>
            <br />
            <div className={styles.parentsContainer}>
                {/* Lado Esquerdo (Mãe em cima, Pai embaixo) */}
                <div className={styles.parentColumn}>
                    <p className={styles.parentName}>Michele Andrea</p>
                    <p className={styles.parentName}>Eduardo Grandi</p>
                </div>

                {/* Lado Direito (Mãe em cima, Pai embaixo) */}
                <div className={styles.parentColumn}>
                    <p className={styles.parentName}>Valdirene Nascimento</p>
                    <p className={styles.parentName}>Marçal Medeiros</p>
                    <span className={styles.starImg}></span>
                    <br />
                    <p className={styles.parentName}> <LuStar /> Paulo Ferreira <LuStar /></p>
                </div>
            </div>
            <br />

            {/* Texto de alegria movido para ABAIXO dos noivos */}
            <div className={styles.textContainer}>
                <h2 className={styles.subTitle}>COM MUITA ALEGRIA</h2>
                <p className={styles.text}>convidamos você para celebrar o nosso casamento</p>
            </div>

            <div className={styles.lineHeart}>
                <div className={styles.line}></div>
                <span className={styles.hearImg}><LuHeart /></span>
                <div className={styles.line}></div>
            </div>

            {/* 3. MENSAGEM FINAL E BOTÃO */}
            <p className={styles.textFooter}>
                SOMOS GRATOS POR TODO AMOR, APOIO E POR FAZEREM PARTE DA NOSSA HISTÓRIA!
            </p>

            <button className={styles.button} onClick={handleConfirmPresence}>
                CONFIRMAR PRESENÇA
            </button>
            <br />
            <br />
        </div>
    );
}