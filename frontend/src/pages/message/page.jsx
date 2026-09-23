import styles from './page.module.css';
import { LuHeart, LuStar } from 'react-icons/lu';

export default function Message() {
    return (
        <div className={styles.bodyContainer}>
            {/* Título Cursivo Grande */}
            <h1 className={styles.title}>Recadinhos</h1>
            <p className={styles.subTitle}>PARA OS NOSSOS CONVIDADOS ESPECIAIS!</p>

            {/* Separador com Coração */}
            <div className={styles.lineHeart}>
                <div className={styles.line}></div>
                <span className={styles.hearImg}><LuHeart /></span>
                <div className={styles.line}></div>
            </div>

            {/* Card Principal do Visual */}
            <div className={styles.giftListContainer}>
                <div className={styles.giftCard}>
                    <h2 className={styles.giftTitle}>Um Toque de Carinho no Visual</h2>
                    
                    <p className={styles.text}>
                        Queremos que vocês se sintam incríveis e confortáveis! Apenas um pedido carinhoso para que nosso álbum de fotos fique perfeito:
                    </p>
                    
                    <div className={styles.lineDivider}></div>

                    <p className={styles.textWarning}>
                        <strong>•</strong> Evitem cores como <strong>Branco</strong>, <strong>Off-White</strong> e tons muito próximos ao vestido da noiva.
                    </p>
                    <p className={styles.textWarning}>
                        <strong>•</strong> Atentem-se também com cores neon e tons excessivamente vibrantes.
                    </p>

                    <div className={styles.lineDivider}></div>

                    <p className={styles.highlightText}>
                        DEIXEMOS O BRILHO DO BRANCO PARA QUEM VAI SUBIR AO ALTAR! ✨
                    </p>
                </div>

                {/* Separador com Estrela */}
                <div className={styles.lineHeart}>
                    <div className={styles.line}></div>
                    <span className={styles.hearImg}><LuStar /></span>
                    <div className={styles.line}></div>
                </div>

                {/* Card de Data e Hora */}
                <div className={styles.giftCard}>
                    <h2 className={styles.giftTitle}>Data e Hora</h2>
                    
                    <p className={styles.dateText}>
                        24 De Outubro de 2026 — Sábado às 16h
                    </p>
                    
                    <div className={styles.lineDivider}></div>

                    <p className={styles.text}>
                        Indicamos que cheguem alguns minutinhos antes da cerimônia para que possam se acomodar e aproveitar cada momento com tranquilidade!
                    </p>
                </div>
            </div>
        </div>
    );
}