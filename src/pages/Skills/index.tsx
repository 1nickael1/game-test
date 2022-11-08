import style from 'styles/Skills.module.scss';
import golpes from 'assets/golpes.json';

import { useStore } from 'store';

export const SkillsPage = () => {

    const { storeHero, learnAttack } = useStore((store) => ({ storeHero: store.hero, learnAttack: store.learnAttack }));

    const golpesAdquiridos = golpes.filter(golpe => storeHero.attacks.find(ataques => ataques == golpe.id));

    function aprenderGolpe(id: number) {
        learnAttack(id);
    }

    return (
        <div className={style.container}>
            <p>Lista de golpes</p>
            <div className={style.listaHabilidades}>
                <p>Taijutsu</p>
                
                <div className={style.listaDeGolpes}>
                    {
                        golpes.map((golpe, index) => (
                            <div className={style.golpe} key={index} title={`Causa ${golpe.damage} de dano`}>
                                <p>{golpe.name}</p>
                                <img src={golpe.image} alt={golpe.name} />
                                {
                                    golpesAdquiridos.find(e => e.id == golpe.id) ? (
                                        <button className={style.golpeButton} disabled>
                                            Aprendido
                                        </button>
                                    ) : (
                                        <button 
                                            disabled={golpe.levelRequired > storeHero.level} 
                                            className={golpe.levelRequired > storeHero.level ? style.disabled : ''}
                                            title={golpe.levelRequired > storeHero.level ? 
                                                `Você precisa ser level ${golpe.levelRequired} para aprender este golpe` :
                                                'Aprender'
                                            }
                                            onClick={() => aprenderGolpe(golpe.id)}
                                        >
                                            Aprender
                                        </button>
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}