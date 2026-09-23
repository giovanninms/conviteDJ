import styles from './page.module.css';
import { LuHeart } from 'react-icons/lu';

export default function Location() {
    // Endereço codificado para ser lido corretamente pelo iframe do Google Maps
    const mapSrc = "https://maps.google.com/maps?q=R.%20Gustavo%20Kruger,%2052%20-%20Heimtal,%20Londrina&t=&z=16&ie=UTF8&iwloc=&output=embed";

    return (
        <div className={styles.bodyContainer}>
            {/* Título e Subtítulo */}
            <h1 className={styles.title}>Localização</h1>
            <p className={styles.subTitle}>TE ESPERAMOS COM MUITO CARINHO!</p>
            
            <br />
            
            {/* Endereço em Destaque */}
            <p className={styles.text}>CHÁCARA ÁGUAS DO CÉU 2</p>
            <p className={styles.text}>R. Gustavo Kruger, 38 - Heimtal, Londrina</p>

            {/* Separador com Coração */}
            <div className={styles.lineHeart}>
                <div className={styles.line}></div>
                <span className={styles.hearImg}><LuHeart /></span>
                <div className={styles.line}></div>
            </div>

            {/* Mapa Limpo em Tela Cheia */}
            <iframe 
                className={styles.map}
                title="Mapa de Localização"
                src={mapSrc}
                loading="lazy"
                allowFullScreen
            />
        </div>
    );
}