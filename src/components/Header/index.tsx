import { Link } from 'react-router-dom';
import styles from 'styles/Header.module.scss';

export default function Header() {
    return (
        <div className={styles.container}>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/battle">Battle</Link>
                    </li>
                    <li>
                        <Link to="/skills">Skills</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}