import { Link } from 'react-router-dom';
import styles from 'styles/Header.module.scss';

import { useStore } from 'store';

export default function Header() {

    const { pontosDisponiveis } = useStore((state) => ({pontosDisponiveis: state.hero.pointsAvailable}))
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
                    <li className={pontosDisponiveis > 0 ? styles.active : ''}>
                        <Link to="/attributes">Atributos {pontosDisponiveis > 0 ? `(${pontosDisponiveis})` : ''}</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}