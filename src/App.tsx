

import Header from "components/Header";
import { Router } from "./routes";
import styles from 'styles/Global.module.scss';

export default function App() {
  return (
    <div className={styles.container}>
      <Header />
      <Router />
      <footer>Versão 0.1</footer>
    </div>
  )
}