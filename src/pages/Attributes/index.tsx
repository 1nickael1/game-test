import { useStore } from 'store';
import style from 'styles/Attributes.module.scss';

export const AttributesPage = () => {
    const { pontosDisponiveis, atributos, distribuirAtributo } = useStore((state) => ({
        pontosDisponiveis: state.hero.pointsAvailable,
        atributos: state.hero.attributes,
        distribuirAtributo: state.learnAttribute,
    }));


    return (
        <div className={style.container}>
            <p>Você tem {pontosDisponiveis} pontos disponíveis para distribuir.</p>
            <div className={style.pontosAtuais}>
                <p>Valores atuais:</p>
                <div style={{display: 'flex', gap: '10px'}}>
                    <p>Ataque: +{atributos.attack * 5}</p>
                    <p>Defesa: +{atributos.defense * 5}</p>
                    <p>Vida: +{atributos.life * 5}</p>
                </div>
            </div>
            <p>Você pode distribuir em:</p>
            <div className={style.option}>
                <p>Força ({atributos.attack})</p>
                <button disabled={pontosDisponiveis <= 0} onClick={() => distribuirAtributo('attack')}>
                    Adicionar
                </button>
            </div>
            <div className={style.option}>
                <p>Defesa ({atributos.defense})</p>
                <button disabled={pontosDisponiveis <= 0} onClick={() => distribuirAtributo('defense')}>
                    Adicionar
                </button>
            </div>
            <div className={style.option}>
                <p>Vida ({atributos.life})</p>
                <button disabled={pontosDisponiveis <= 0} onClick={() => distribuirAtributo('life')}>
                    Adicionar
                </button>
            </div>
        </div>
    )
}