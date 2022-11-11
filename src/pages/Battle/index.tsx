import { useState, useEffect } from 'react'
import shallow from 'zustand/shallow';

import style from 'styles/Battle.module.scss';
import golpes from 'assets/golpes.json';
import boss from 'assets/bosses.json';

import { useStore } from 'store';

export const BattlePage = () => {
  const [lastAttack, setLastAttack] = useState(0);
  const [countAttacks, setCountAttacks] = useState(0);

  const { storeHero, storeEnemy, batalhar, atacar, batteLog, endBattle } = useStore(
    (store) => ({
      storeHero: store.hero,
      storeEnemy: store.enemy,
      batalhar: store.startBattle,
      atacar: store.attack,
      batteLog: store.battleLog,
      endBattle: store.endBattle
    }));

  useEffect(() => {
    setLastAttack(0);
    setCountAttacks(0);
  },[storeEnemy == null]);

  function iniciarBatalha(type: 'normal' | number) {
    batalhar(type);
  }
  
  function golpear(id: number) {
    if(storeHero.attacks.length > 5) {
      setLastAttack(id);
    }

    if(id == 999) {
      setCountAttacks(0);
    } else {
      setCountAttacks(prevState => prevState + 1);
    }
    atacar(id);
  }

  function encerrarBatalha() {
    endBattle();
  }

  return (
    <div className={style.container}>
      <div className={style.battleContainer}>
        <div className={style.hero}>
            <div className={style.heroInfo}>
              <p>{storeHero.name} level: {storeHero.level}</p>
              <p>XP</p>
              <div className={style.heroXpBar}>
                <div style={{'width': `${storeHero.xp.percent}%`}} className={style.heroXpBarColor}>
                  <p className={style.percent}>{storeHero.xp.actual}/{storeHero.xp.max}</p>
                </div>
              </div>
              <p>Life: {storeHero.life.actual}</p>
              <div className={style.lifeBar}>
                <div style={{'width': `${storeHero.life.percent}%`}} className={style.lifeBarColor}>
                  <p className={style.percent}>{storeHero.life.percent}%</p>
                </div>
              </div>
            </div>
            {
              storeEnemy !== null && (
                <div className={style.golpes}>
                  {
                    storeHero.attacks.map((golpeID: number, index: number) => {
                    let [golpe] = golpes.filter(e => e.id == golpeID);

                      return (
                        <button disabled={golpeID == lastAttack} title={`${golpe.name} causa ${golpe.damage} de dano`} onClick={() => golpear(golpeID)} key={index}>
                          <img src={golpe.image} alt={golpe.name} />
                        </button>
                      )
                    })
                  }
                </div>
              )
            }

            {
              storeEnemy !== null && countAttacks >= 15 && (
                <button title="Ataque especial" onClick={() => golpear(999)}>
                  <img src="/taijutsu/special_attack.gif" alt="Ataque especial" />
                </button>
              )
            }

          {
            storeEnemy !== null && storeEnemy.level > storeHero.level && (
              <button onClick={encerrarBatalha}>Desistir</button>
            )
          }
        </div>
        <div className={style.enemy}>
          {
            storeEnemy == null ? (
              <div>
                <button onClick={() => iniciarBatalha('normal')}>Batalhar</button>
              </div>
            ) : (
              <div className={style.enemyLog}>
                <img src={storeEnemy.image} alt={storeEnemy.name} />
                <p>{storeEnemy.name} level: {storeEnemy.level}</p>
                <p>Life: {storeEnemy.life}</p>
                <div className={style.lifeBar}>
                  <div style={{'width': `${storeEnemy.lifePercent}%`}} className={style.lifeBarColor}>
                    <p className={style.percent}>{storeEnemy.lifePercent}%</p>
                  </div>
                </div>
              </div>
            )
          }
          
          {
            storeEnemy == null && storeHero.level >= 5 && (
                boss.map((boss, index) => (
                  <button onClick={() => iniciarBatalha(boss.id)} key={index}>
                    <p>Batalhar contra boss:</p>
                    <p>{boss.name}</p>
                    <p>Level: {boss.level}</p>
                    <p>Life: {boss.life}</p>
                  </button>
                ))
              )
          }
        </div>
      </div>
        {batteLog.length > 0 && (
          <div className={style.battleLog}>
            <div className={style.messagesContainer}>
              {
                batteLog.map((e, index) => (
                  <p className={style.message} key={index}>{e}</p>
                ))
              }
            </div>
          </div>
        )}
    </div>
  );
}