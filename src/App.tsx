import { useState, useEffect } from 'react'
import shallow from 'zustand/shallow';

import style from 'styles/Home.module.scss';
import golpes from 'assets/golpes.json';

import { useStore } from 'store';

// const useBattle = () => {
//   const { storeHero, storeEnemy, batalhar, atacar, batteLog } = useStore(
//     (store) => ({
//       storeHero: store.hero,
//       storeEnemy: store.enemy,
//       batalhar: store.lutar,
//       atacar: store.attack,
//       batteLog: store.battleLog
//     }),
//     shallow
//   )
  
//   return { storeHero, storeEnemy, batalhar, atacar, batteLog };
// }


export default function index() {

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
          <p>{storeHero.name}</p>
            {
              storeEnemy !== null && (
                <div className={style.golpes}>
                  {
                    storeHero.attacks.map((golpeID: number, index: number) => {
                    let [golpe] = golpes.filter(e => e.id == golpeID);

                      return (
                        <button onClick={() => golpear(golpeID)} key={index}>
                          <p>{golpe.name}</p>
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
              <button onClick={endBattle}>Desistir</button>
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
      <div className={style.battleLog}>
        {batteLog.map((e, index) => (
          <p key={index}>{e}</p>
        ))}
      </div>
    </div>
  );
}