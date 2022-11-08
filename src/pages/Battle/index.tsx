import { useState, useEffect } from 'react'
import shallow from 'zustand/shallow';

import style from 'styles/Battle.module.scss';
import golpes from 'assets/golpes.json';

import { useStore } from 'store';

export const BattlePage = () => {

  const { storeHero, storeEnemy, batalhar, atacar, batteLog, endBattle } = useStore(
    (store) => ({
      storeHero: store.hero,
      storeEnemy: store.enemy,
      batalhar: store.lutar,
      atacar: store.attack,
      batteLog: store.battleLog,
      endBattle: store.endBattle
    }));

  useEffect(() => {
    
  },[]);

  function iniciarBatalha() {
    batalhar();
  }
  
  function golpear(id: number) {
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
              <div className={style.heroXpBar}>
                <div style={{'width': `${storeHero.xp.percent}%`}} className={style.heroXpBarColor}>
                  <p className={style.percent}>{storeHero.xp.actual}/{storeHero.xp.max}</p>
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
                        <button title={`${golpe.name} cause ${golpe.damage} de dano`} onClick={() => golpear(golpeID)} key={index}>
                          <img src={golpe.image} alt={golpe.name} />
                        </button>
                      )
                    })
                  }
                </div>
              )
            }

          {
            storeEnemy !== null && (
              <button onClick={encerrarBatalha}>Desistir</button>
            )
          }
        </div>
        <div className={style.enemy}>
          {
            storeEnemy == null ? (
              <div>
                <button onClick={() => iniciarBatalha()}>Batalhar</button>
              </div>
            ) : (
              <div className={style.enemyLog}>
                <img src={storeEnemy.image} alt={storeEnemy.name} />
                <div>{storeEnemy.name} level: {storeEnemy.level}</div>
                <div>Life: {storeEnemy.life}</div>
                <div className={style.lifeBar}>
                  <div style={{'width': `${storeEnemy.lifePercent}%`}} className={style.lifeBarColor}>
                    <p className={style.percent}>{storeEnemy.lifePercent}%</p>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
        {batteLog.length > 0 && (
          <div className={style.battleLog}>
            {
              batteLog.map((e, index) => (
                <p key={index}>{e}</p>
              ))
            }
          </div>
        )}
    </div>
  );
}