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
                attacks: [1,2],
                xp: {
                    actual: 0,
                    max: 100,
                    percent: 0
                }
            },
            enemy: null,
            battleLog: [],
            attack: (attackID: number) => {
                const { levelUp, getRandomNumberBetweenMaxAndMin, hero, enemy } = get();

                const enemyCopy = {...enemy};
                let newEnemy = enemyCopy == null ? null : {...enemy};
                if(newEnemy !== null) {
                    // @ts-ignore
                    const [originalEnemy] = enemies.filter(e => e.id == newEnemy.id);
                    
                    let [golpe] = golpes.filter((golpe: GolpesType) => golpe.id == attackID);
    
                    const dano = getRandomNumberBetweenMaxAndMin(((golpe.damage * 1.1) + hero.level), golpe.damage);
                    // @ts-ignore
                    let danoTotal = dano - newEnemy.defense;
    
                    if (danoTotal <= 0) {
                        set((state) => ({ battleLog: [...state.battleLog, `Você usou ${golpe.name} e causou  0 de dano`] }));
                        return;
                    }
    
                    // @ts-ignore
                    newEnemy.life = newEnemy.life - danoTotal;
                    newEnemy.lifePercent = Math.round((newEnemy.life / originalEnemy.life) * 100);
    
                    if (newEnemy.life <= 0) {
                        // @ts-ignore
                        const XpReceived = getRandomNumberBetweenMaxAndMin( (originalEnemy.life * 0.5) + ((hero.level * newEnemy.level) * 1.9), 10);

                        levelUp(XpReceived);

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
                const { getRandomNumberBetweenMaxAndMin, hero } = get();
                
                const maxLevelEnabled = (hero.level + 1) >= 3 ? 3 : hero.level + 1;
                const minLevelEnabled = (hero.level - 1) <= 0 ? 1 : (hero.level - 1);

                const randomEnemyLevel = getRandomNumberBetweenMaxAndMin(maxLevelEnabled, minLevelEnabled > maxLevelEnabled ? maxLevelEnabled : minLevelEnabled);

                const getEnemiesBetweenLevel = enemies.filter(e => e.level == randomEnemyLevel);

                let maxEnemies = getEnemiesBetweenLevel.length - 1;

                let enemyRandom = getRandomNumberBetweenMaxAndMin(maxEnemies, 0);

                let [newEnemy] = [...getEnemiesBetweenLevel.filter((_, index) => index == enemyRandom)];
                set(() => ({ enemy: newEnemy, battleLog: [] }));
            },
            endBattle: () => {
                set(() => ({ enemy: null, battleLog: [] }))
            },
            levelUp(XpReceived: number) {
                const actualXp = get().hero.xp;
                const actualHeroLevel = get().hero.level;

                let newXp = actualXp.actual + XpReceived;

                
                if(newXp > actualXp.max) {
                    let newXpValue = newXp - actualXp.max;
                    let newXpMax = Math.round(actualXp.max + (actualXp.max * 1.2));
                    let newLevel = actualHeroLevel + 1;
                    const xpPercent = Math.round((newXpValue / newXpMax) * 100);
                    
                    set((state) => ({
                        battleLog: [ `Você venceu a batalha`, `Você está no level ${newLevel}`],
                        hero: {
                            ...state.hero,
                            level: newLevel,
                            xp: {
                                actual: newXpValue,
                                max: newXpMax,
                                percent: xpPercent
                            }
                        },
                        enemy: null
                    }))
                } else {
                    const xpPercent = Math.round((newXp / actualXp.max) * 100);
                    set((state) => ({
                        battleLog: [`Você venceu a batalha`, `Você recebeu ${XpReceived} de XP`],
                        hero: {
                            ...state.hero,
                            xp: {
                                ...state.hero.xp,
                                actual: newXp,
                                percent: xpPercent
                            }
                        },
                        enemy: null
                    }))
                }
            },
            getRandomNumberBetweenMaxAndMin(max, min) {
                return Math.round(Math.random() * (max - min) + min)
            },
        }),
        { name: 'store', version: 0.1 }
    )
)
