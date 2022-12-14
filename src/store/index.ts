import create from 'zustand';
import { persist } from 'zustand/middleware';

import { EnemyType, GolpesType, HeroType, StoreType } from './types';
import golpes from 'assets/golpes.json';
import enemies from 'assets/enemies.json';
import bosses from 'assets/bosses.json';

export const bonusAttack = 2;
export const bonusDefense = 2;
export const bonusLife = 10;

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
                defense: 1,
                level: 1,
                attacks: [1],
                xp: {
                    actual: 0,
                    max: 100,
                    percent: 0
                },
                attributes: {
                    attack: 0,
                    defense: 0,
                    life: 0
                },
                pointsAvailable: 10,
            },
            enemy: null,
            battleLog: [],
            attack: (attackID: number) => {
                const { levelUp, getRandomNumberBetweenMaxAndMin, hero, enemy } = get();

                const enemyCopy = {...enemy};
                let newEnemy = enemyCopy == null ? null : {...enemy};
                let newHero = {...hero};
                if(newEnemy !== null) {
                    let originalEnemy: EnemyType;
                    if(newEnemy.type == 'normal') {
                        // @ts-ignore
                        originalEnemy = enemies.filter(e => e.id == newEnemy.id)[0];
                    } else {
                        // @ts-ignore
                        originalEnemy = bosses.filter(e => e.id == newEnemy.id)[0];
                    }

                    if(attackID == 999) {
                        // @ts-ignore
                        const finalDamage = Math.round(newEnemy.life - (originalEnemy.life * 0.1));
                        newEnemy.life = finalDamage;
                        newEnemy.lifePercent = Math.round((newEnemy.life / originalEnemy.life) * 100);

                        if (newEnemy.life <= 0) {
                            // @ts-ignore
                            const XpReceived = originalEnemy.type ==! 'normal' ? ((originalEnemy.life * 1.5) + (newHero.xp.max * 0.1)) : getRandomNumberBetweenMaxAndMin( (originalEnemy.life * 0.8) + (newHero.xp.max* 0.2), (newHero.xp.max* 0.5));
    
                            levelUp(XpReceived);
    
                            return;
                        }

                        // @ts-ignore
                        set((state) => ({ 
                            battleLog: [
                                ...state.battleLog, 
                                `Voc?? usou ataque especial e causou ${finalDamage} de dano
                                `],
                            enemy: {...newEnemy},
                        }));
                        return;
                    }

                    const golpeAleatorio = originalEnemy.attacks[getRandomNumberBetweenMaxAndMin(originalEnemy.attacks.length - 1, 0)]

                    const golpeInimigo = golpes.filter((golpe: GolpesType) => {
                        return golpe.id == golpeAleatorio;
                    })[0];


                    const defenseOfHeroWithAttributes = Math.round(newHero.attributes.defense / bonusDefense);
                    
                    // @ts-ignore
                    // const danoOfEnemy = getRandomNumberBetweenMaxAndMin((golpeInimigo.damage * newEnemy.level), newHero.defense);
                    const danoOfEnemy = golpeInimigo.damage + newEnemy.level;
                    // console.log(danoOfEnemy)
                    
                    const totalDamageOfEnemy = (danoOfEnemy - (newHero.defense + defenseOfHeroWithAttributes)) <= 0 ? 0 : danoOfEnemy - (newHero.defense + defenseOfHeroWithAttributes);
                    
                    let [golpe] = golpes.filter((golpe: GolpesType) => golpe.id == attackID);

                    const damageOfHeroWithAttributes = Math.round(newHero.attributes.attack / bonusAttack);
                    
    
                    const danoOfHero = getRandomNumberBetweenMaxAndMin(((golpe.damage * newHero.level) + damageOfHeroWithAttributes), golpe.damage + damageOfHeroWithAttributes + (originalEnemy.defense * 2));
                    // const danoOfHero = golpe.damage + newHero.level + damageOfHeroWithAttributes;
                    // @ts-ignore
                    const totalDamageOfHero = (danoOfHero - newEnemy.defense) <= 0 ? 0 : danoOfHero - newEnemy.defense;

                    // @ts-ignore
                    newEnemy.life = newEnemy.life - totalDamageOfHero;
                    newEnemy.lifePercent = Math.round((newEnemy.life / originalEnemy.life) * 100);
    
                    if (newEnemy.life <= 0) {
                        // @ts-ignore
                        const XpReceived = originalEnemy.type ==! 'normal' ? ((originalEnemy.life * 1.5) + (newHero.xp.max * 0.1)) : getRandomNumberBetweenMaxAndMin( (originalEnemy.life * 0.5) + (newHero.xp.max* 0.1), (newHero.xp.max* 0.1));

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
                                'Voc?? perdeu a batalha'
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
                            `Voc?? usou ${golpe.name} e causou ${totalDamageOfHero <= 0 ? 0 : totalDamageOfHero} de dano; \n
                            ${originalEnemy.name} usou ${golpeInimigo.name} e causou ${totalDamageOfEnemy <= 0 ? 0 : totalDamageOfEnemy} de dano
                            `],
                        enemy: {...newEnemy},
                        hero: {...newHero}
                    }));
                }
            },
            startBattle: (type) => {

                if(type === 'normal') {
                    const { getRandomNumberBetweenMaxAndMin, hero } = get();
                    
                    const maxLevelEnabled = (hero.level + 1) >= 9 ? 9 : hero.level + 1;
                    const minLevelEnabled = (hero.level - 1) <= 0 ? 1 : (hero.level - 1);
    
                    const randomEnemyLevel = getRandomNumberBetweenMaxAndMin(maxLevelEnabled, minLevelEnabled > maxLevelEnabled ? maxLevelEnabled : minLevelEnabled);
    
                    const getEnemiesBetweenLevel = enemies.filter(e => e.level == randomEnemyLevel);
    
                    let maxEnemies = getEnemiesBetweenLevel.length - 1;
    
                    let enemyRandom = getRandomNumberBetweenMaxAndMin(maxEnemies, 0);
    
                    let newEnemy: EnemyType = getEnemiesBetweenLevel.filter((_, index) => index == enemyRandom)[0];

                    set(() => ({ enemy: {...newEnemy}, battleLog: [] }));
                } else {
                    const getBoss: EnemyType = bosses.filter(e => e.id == type)[0];

                    set(() => ({ enemy: {...getBoss}, battleLog: [] }));
                }
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
                const actualHeroDefense = get().hero.defense;
                const actualHeroPointsAvailable = get().hero.pointsAvailable;
                const actualHeroAttributes = get().hero.attributes;
                const { getRandomNumberBetweenMaxAndMin } = get();

                let newXp = actualXp.actual + XpReceived;

                
                if(newXp >= actualXp.max) {
                    let newXpValue = newXp - actualXp.max;
                    let newXpMax = actualXp.max * 2;
                    let newLevel = actualHeroLevel + 1;
                    let actualLifeBonus = actualHeroAttributes.life * bonusLife;

                    const actualHeroLifeWithoutBonuts = actualHeroLifeMax - actualLifeBonus;

                    let newLifeMax = Math.round((actualHeroLifeWithoutBonuts * 1.2) + (actualHeroLifeWithoutBonuts * 0.2) + actualLifeBonus);
                    let newDefense = Math.round((actualHeroDefense * 1.4));

                    function pointToReceive() {
                        if(newLevel <= 4) {
                            return 3;
                        } else if(newLevel <= 6) {
                            return 5;
                        } else {
                            return 10;
                        }
                    }

                    let newPointsAvailable = actualHeroPointsAvailable + pointToReceive();

                    const xpPercent = Math.round((newXpValue / newXpMax) * 100);
                    
                    set((state) => ({
                        battleLog: [ 
                            `Voc?? venceu a batalha`, 
                            `Voc?? est?? no level ${newLevel} e est?? com ${newPointsAvailable} pontos disponiveis`],
                        hero: {
                            ...state.hero,
                            level: newLevel,
                            defense: newDefense,
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
                            },
                            pointsAvailable: newPointsAvailable
                        },
                        enemy: null
                    }))
                } else {
                    const xpPercent = Math.round((newXp / actualXp.max) * 100);
                    set((state) => ({
                        battleLog: [`Voc?? venceu a batalha`, `Voc?? recebeu ${XpReceived} de XP`],
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
            learnAttribute(type) {
                const { life, attributes, pointsAvailable} = get().hero;

                if(pointsAvailable <= 0) return;
                
                if(type === 'attack') {
                    set((state) => ({
                        hero: {
                            ...state.hero,
                            attributes: {
                                ...state.hero.attributes,
                                attack: state.hero.attributes.attack + 1
                            },
                            pointsAvailable: state.hero.pointsAvailable - 1
                        }
                    }))
                }

                if(type === 'defense') {
                    set((state) => ({
                        hero: {
                            ...state.hero,
                            attributes: {
                                ...state.hero.attributes,
                                defense: state.hero.attributes.defense + 1
                            },
                            pointsAvailable: state.hero.pointsAvailable - 1
                        }
                    }))
                }

                if(type === 'life') {
                    const actualLifeBonus = attributes.life * bonusLife;
                    const actualHeroLifeWithoutBonuts = life.max - actualLifeBonus;
                    const newLifeBonus = (attributes.life + 1) * bonusLife;
                    const newHeroLifeWithBonus = actualHeroLifeWithoutBonuts + newLifeBonus;

                    set((state) => ({
                        hero: {
                            ...state.hero,
                            life: {
                                ...state.hero.life,
                                actual: newHeroLifeWithBonus,
                                max: newHeroLifeWithBonus,
                            },
                            attributes: {
                                ...state.hero.attributes,
                                life: state.hero.attributes.life + 1,
                            },
                            pointsAvailable: state.hero.pointsAvailable - 1
                        }
                    }))
                }
            },
            removeAttribute(type) {
                const { life, attributes, pointsAvailable} = get().hero;

                
                if(type === 'attack') {
                    if(attributes.attack <= 0) return;

                    set((state) => ({
                        hero: {
                            ...state.hero,
                            attributes: {
                                ...state.hero.attributes,
                                attack: state.hero.attributes.attack - 1
                            },
                            pointsAvailable: state.hero.pointsAvailable + 1
                        }
                    }))
                }

                if(type === 'defense') {
                    if(attributes.defense <= 0) return;

                    set((state) => ({
                        hero: {
                            ...state.hero,
                            attributes: {
                                ...state.hero.attributes,
                                defense: state.hero.attributes.defense - 1
                            },
                            pointsAvailable: state.hero.pointsAvailable + 1
                        }
                    }))
                }

                if(type === 'life') {
                    if(attributes.life <= 0) return;

                    const actualLifeBonus = attributes.life * bonusLife;
                    const actualHeroLifeWithoutBonuts = life.max - actualLifeBonus;
                    const newLifeBonus = (attributes.life - 1) * bonusLife;
                    const newHeroLifeWithBonus = actualHeroLifeWithoutBonuts + newLifeBonus;

                    set((state) => ({
                        hero: {
                            ...state.hero,
                            life: {
                                ...state.hero.life,
                                actual: newHeroLifeWithBonus,
                                max: newHeroLifeWithBonus,
                            },
                            attributes: {
                                ...state.hero.attributes,
                                life: state.hero.attributes.life - 1,
                            },
                            pointsAvailable: state.hero.pointsAvailable + 1
                        }
                    }))
                }
            },
        }),
        { name: 'store', version: 0.2 }
    )
)
