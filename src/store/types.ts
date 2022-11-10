export interface GolpesType {
    id: number;
    name: string;
    damage: number;
    image: string;
}

interface Attributes {
    attack: number;
    defense: number;
    life: number;
}

export interface EnemyType {
    id: number;
    name: string;
    life: number;
    defense: number;
    level: number;
    lifePercent: number;
    image: string;
    attacks: number[];
}

interface XpType {
    actual: number;
    max: number;
    percent: number;
}

interface HeroLifeType {
    actual: number;
    max: number;
    percent: number;
}

export interface HeroType {
    name: string;
    life: HeroLifeType;
    defense: number;
    level: number;
    attacks: number[];
    xp: XpType;
    attributes: Attributes;
    pointsAvailable: number;
}

export interface StoreType {
    hero: HeroType;
    enemy: null | EnemyType;
    battleLog: string[];
    attack: (attackID: number) => void;
    startBattle: () => void;
    endBattle: () => void;
    levelUp: (XpReceived: number) => void;
    getRandomNumberBetweenMaxAndMin: (max: number, min: number) => number;
    learnAttack: (attackID: number) => void;
    learnAttribute: (type: 'attack' | 'defense' | 'life') => void;
    removeAttribute: (type: 'attack' | 'defense' | 'life') => void;
}