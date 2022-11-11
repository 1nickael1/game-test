import { useStore, bonusAttack, bonusLife, bonusDefense } from 'store';
import style from 'styles/Attributes.module.scss';

export const AttributesPage = () => {
    const { pontosDisponiveis, atributos, distribuirAtributo, removerAtributo } = useStore((state) => ({
        pontosDisponiveis: state.hero.pointsAvailable,
        atributos: state.hero.attributes,
        distribuirAtributo: state.learnAttribute,
        removerAtributo: state.removeAttribute,
    }));


    return (
        <div className={style.container}>
            <p>Você tem {pontosDisponiveis} pontos disponíveis para distribuir.</p>
            <div className={style.pontosAtuais}>
                <p>Valores atuais:</p>
                <div style={{display: 'flex', gap: '10px'}}>
                    <p>Ataque: +{atributos.attack * bonusAttack}</p>
                    <p>Defesa: +{atributos.defense * bonusDefense}</p>
                    <p>Vida: +{atributos.life * bonusLife}</p>
                </div>
            </div>
            <p>Você pode distribuir em:</p>
            <div className={style.option}>
                <p>Força ({atributos.attack})</p>
                <div className={style.buttons}>
                    <button disabled={pontosDisponiveis <= 0} onClick={() => distribuirAtributo('attack')}>
                        Adicionar
                    </button>
                    <button disabled={atributos.attack <= 0} onClick={() => removerAtributo('attack')}>
                        Remover
                    </button>
                </div>
            </div>
            <div className={style.option}>
                <p>Defesa ({atributos.defense})</p>
                <div className={style.buttons}>
                    <button disabled={pontosDisponiveis <= 0} onClick={() => distribuirAtributo('defense')}>
                        Adicionar
                    </button>
                    <button disabled={atributos.defense <= 0} onClick={() => removerAtributo('defense')}>
                        Remover
                    </button>
                </div>
            </div>
            <div className={style.option}>
                <p>Vida ({atributos.life})</p>
                <div className={style.buttons}>
                    <button disabled={pontosDisponiveis <= 0} onClick={() => distribuirAtributo('life')}>
                        Adicionar
                    </button>
                    <button disabled={atributos.life <= 0} onClick={() => removerAtributo('life')}>
                        Remover
                    </button>
                </div>
            </div>

            <div className={style.pontosAtuais}>
                <p>Formulas:</p>
                <div>
                    <p>Ataque: dano de golpe + (ponto * {bonusAttack})</p>
                    <p>Defesa: dano do inimigo - (ponto / {bonusDefense})</p>
                    <p>Vida: +ponto * {bonusLife}</p>
                </div>
            </div>
        </div>
    )
}