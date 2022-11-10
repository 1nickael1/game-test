import { Link } from 'react-router-dom';
import styles from 'styles/Header.module.scss';

export default function Header() {
    return (
        <div className={styles.container}>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Inicio</Link>
                    </li>
                    <li>
                        <Link to="/battle">Batalhar</Link>
                    </li>
                    <li>
                        <Link to="/skills">Habilidades</Link>
                    </li>
                    <li>
                        <Link to="/attributes">Atributos</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}