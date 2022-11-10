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
                life: {
                    actual: 100,
                    max: 100,
                    percent: 100
                },
                defense: 10,
                level: 1,
                attacks: [1],
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
                let newHero = {...hero};
                if(newEnemy !== null) {
                    // @ts-ignore
                    const [originalEnemy] = enemies.filter(e => e.id == newEnemy.id);

                    const golpeAleatorio = originalEnemy.attacks[getRandomNumberBetweenMaxAndMin(originalEnemy.attacks.length - 1, 0)]

                    const golpeInimigo = golpes.filter((golpe: GolpesType) => {
                        return golpe.id == golpeAleatorio;
                    })[0];


                    const danoOfEnemy = getRandomNumberBetweenMaxAndMin(((golpeInimigo.damage * 1.1) + originalEnemy.level), golpeInimigo.damage);

                    const totalDamageOfEnemy = (danoOfEnemy - newHero.defense) <= 0 ? 0 : danoOfEnemy - newHero.defense;
                    
                    let [golpe] = golpes.filter((golpe: GolpesType) => golpe.id == attackID);
    
                    const danoOfHero = getRandomNumberBetweenMaxAndMin(((golpe.damage * 1.1) + newHero.level), golpe.damage);
                    // @ts-ignore
                    const totalDamageOfHero = (danoOfHero - newEnemy.defense) <= 0 ? 0 : danoOfHero - newEnemy.defense;

                    // @ts-ignore
                    newEnemy.life = newEnemy.life - totalDamageOfHero;
                    newEnemy.lifePercent = Math.round((newEnemy.life / originalEnemy.life) * 100);
    
                    if (newEnemy.life <= 0) {
                        // @ts-ignore
                        const XpReceived = getRandomNumberBetweenMaxAndMin( (originalEnemy.life * 0.5) + ((newHero.level * newEnemy.level) * 1.9), 10);

                        levelUp(XpReceived);

                        return;
                    }

                    newHero.life.actual = (newHero.life.actual - totalDamageOfEnemy) <= 0 ? 0 : newHero.life.actual - totalDamageOfEnemy;
                    newHero.life.percent = Math.round((newHero.life.actual / newHero.life.max) * 100);

                    if (newHero.life.actual <= 0) {
                        newHero.life.actual = newHero.life.max;
                        newHero.life.percent = 100;
                        // @ts-ignore
                        set(() => ({
                            battleLog: [
                                'Você perdeu a batalha'
                            ],
                            enemy: null,
                            hero: {...newHero}
                        }))

                        return;
                    }

                    // @ts-ignore
                    set((state) => ({ 
                        battleLog: [
                            ...state.battleLog, 
                            `Você usou ${golpe.name} e causou ${totalDamageOfHero <= 0 ? 0 : totalDamageOfHero} de dano; \n
                            ${originalEnemy.name} usou ${golpeInimigo.name} e causou ${totalDamageOfEnemy <= 0 ? 0 : totalDamageOfEnemy} de dano
                            `],
                        enemy: {...newEnemy},
                        hero: {...newHero}
                    }));
                }
            },
            startBattle: () => {
                const { getRandomNumberBetweenMaxAndMin, hero } = get();
                
                const maxLevelEnabled = (hero.level + 1) >= 7 ? 7 : hero.level + 1;
                const minLevelEnabled = (hero.level - 1) <= 0 ? 1 : (hero.level - 1);

                const randomEnemyLevel = getRandomNumberBetweenMaxAndMin(maxLevelEnabled, minLevelEnabled > maxLevelEnabled ? maxLevelEnabled : minLevelEnabled);

                const getEnemiesBetweenLevel = enemies.filter(e => e.level == randomEnemyLevel);

                let maxEnemies = getEnemiesBetweenLevel.length - 1;

                let enemyRandom = getRandomNumberBetweenMaxAndMin(maxEnemies, 0);

                let [newEnemy] = [...getEnemiesBetweenLevel.filter((_, index) => index == enemyRandom)];
                set(() => ({ enemy: newEnemy, battleLog: [] }));
            },
            endBattle: () => {
                set((state) => ({ 
                    enemy: null, 
                    battleLog: [],
                    // hero: {
                    //     ...state.hero,
                    //     life: {
                    //         ...state.hero.life,
                    //         actual: state.hero.life.max,
                    //         percent: 100
                    //     }
                    // }
                 }))
            },
            levelUp(XpReceived: number) {
                const actualXp = get().hero.xp;
                const actualHeroLevel = get().hero.level;
                const actualHeroLifeMax = get().hero.life.max;

                let newXp = actualXp.actual + XpReceived;

                
                if(newXp >= actualXp.max) {
                    let newXpValue = newXp - actualXp.max;
                    let newXpMax = Math.round(actualXp.max + (actualXp.max * 1.2));
                    let newLevel = actualHeroLevel + 1;
                    let newLifeMax = Math.round((actualHeroLifeMax * 1.2) + (actualHeroLifeMax * 0.2));
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
                            },
                            life: {
                                ...state.hero.life,
                                actual: newLifeMax,
                                percent: 100,
                                max: newLifeMax
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
            learnAttack(attackID) {
                const { hero } = get();
                const allAttacks = golpes;
                const [attackToLearn] = allAttacks.filter(attack => attack.id == attackID);

                if(hero.level < attackToLearn.levelRequired) {
                    return;
                }

                set((state) => ({
                    hero: {
                        ...state.hero,
                        attacks: [...state.hero.attacks, attackToLearn.id]
                    }
                }))
            },
        }),
        { name: 'store', version: 0.2 }
    )
)
