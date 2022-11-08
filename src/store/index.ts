import create from 'zustand';
import { persist } from 'zustand/middleware';

import { EnemyType, GolpesType, HeroType, StoreType } from './types';
import golpes from 'assets/golpes.json';
import enemies from 'assets/enemies.json';



export const useStore = create(
    persist<StoreType>(
        (set, get) => ({
            hero: {
                name: "heroi",
                life: 50,
                defense: 10,
                level: 1,
                attacks: [1,2]
            },
            enemy: null,
            battleLog: [],
            attack: (attackID: number) => {
                const enemyCopy = get().enemy;
                let newEnemy = enemyCopy == null ? null : {...get().enemy};
                if(newEnemy !== null) {
                    // @ts-ignore
                    const [originalEnemy] = enemies.filter(e => e.id == newEnemy.id);
                    
                    let [golpe] = golpes.filter((golpe: GolpesType) => golpe.id == attackID);
    
                    // @ts-ignore
                    let danoTotal = golpe.damage - newEnemy.defense;
    
                    if (danoTotal <= 0) {
                        set((state) => ({ battleLog: [...state.battleLog, `Você usou ${golpe.name} e causou  0 de dano`] }));
                        return;
                    }
    
                    // @ts-ignore
                    newEnemy.life = newEnemy.life - danoTotal;
                    newEnemy.lifePercent = Math.round((newEnemy.life / originalEnemy.life) * 100);
    
                    if (newEnemy.life <= 0) {
                        set(({
                            battleLog: [`Você venceu a batalha`],
                            enemy: null
                        }));
                        return;
                    }
                    
                    // @ts-ignore
                    set((state) => ({
                        battleLog: [...state.battleLog, `Você usou ${golpe.name} e causou ${danoTotal} de dano`],
                        enemy: newEnemy == null ? null : {...newEnemy}
                    }));
                }


            },
            lutar: () => {
                let maxEnemies = enemies.length;

                let enemyRandom = Math.round(Math.random() * (maxEnemies - 1) + 1);

                let [newEnemy] = [...enemies.filter(enemy => enemy.id == enemyRandom)];
                set(() => ({ enemy: newEnemy, battleLog: [] }));
            },
            endBattle: () => {
                set(() => ({ enemy: null, battleLog: [] }))
            }
        }),
        { name: 'store' }
    )
)
