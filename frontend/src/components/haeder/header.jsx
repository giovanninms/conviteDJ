import styles from "./header.module.css"
import { Link } from "react-router-dom"

export default function Header() {
    return (
        <header className={styles.headerContainer}>
             <Link className={styles.headerLogo} to={'/'}><img className={styles.headerLogo} src="/brasao.png" alt="Brasão" /></Link>
        </header>
    )
}