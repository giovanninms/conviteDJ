import styles from "./navbar.module.css"
import { LuCamera, LuGift, LuMapPin, LuMail, LuHouse } from "react-icons/lu"
import { Link } from "react-router-dom"


export default function Navbar() {
    return (
        <div>
        <nav className={styles.navbarContainer}>
            <div className={styles.navbarItems} >
                <div className={styles.navbarLinksContainer}>
                    <Link to={'/'}>< LuHouse className={styles.navbarLink} /></Link>
                    <Link to={"/location"}>< LuMapPin className={styles.navbarLink} /></Link>
                    <Link to={'/gifts'}>< LuGift className={styles.navbarLink} /></Link>
                    {/* <Link to={'/photos'}>< LuCamera className={styles.navbarLink} /></Link> */}
                    <Link to={'/message'}>< LuMail className={styles.navbarLink} /></Link>
                    
                </div>
            </div>
        </nav>
        </div>
    )
}