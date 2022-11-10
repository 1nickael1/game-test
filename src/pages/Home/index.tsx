import style from 'styles/Home.module.scss';

import { useStore } from 'store';
import golpes from 'assets/golpes.json';

export const HomePage = () => {

    const { storeHero } = useStore((store) => ({ storeHero: store.hero }));

    const golpesAdquiridos = golpes.filter(golpe => storeHero.attacks.find(ataques => ataques == golpe.id));
        
    return (
        <div className={style.container}>
            <p>{storeHero.name} level: {storeHero.level}</p>
            <div className={style.infos}>
                <p>Experiencia</p>
                <div className={style.heroXpBar}>
                    <div style={{'width': `${storeHero.xp.percent}%`}} className={style.heroXpBarColor}>
                        <p className={style.percent}>{storeHero.xp.actual}/{storeHero.xp.max}</p>
                    </div>
                </div>
                <div>Life: {storeHero.life.actual}</div>
                <div className={style.lifeBar}>
                    <div style={{'width': `${storeHero.life.percent}%`}} className={style.lifeBarColor}>
                    <p className={style.percent}>{storeHero.life.percent}%</p>
                    </div>
                </div>
                <div className={style.listaHabilidades}>
                    <p>Golpes adquiridos</p>
                    {
                        golpesAdquiridos.length > 0 && (
                            <div className={style.listaDeGolpes}>
                                {
                                    golpesAdquiridos.map((golpe, index) => (
                                        <div className={style.golpe} key={index} title={`Causa ${golpe.damage} de dano`}>
                                            <p>{golpe.name}</p>
                                            <img src={golpe.image} alt={golpe.name} />
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}