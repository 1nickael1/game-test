export interface GolpesType {
    id: number;
    name: string;
    damage: number;
    image: string;
}

export interface EnemyType {
    id: number;
    name: string;
    life: number;
    defense: number;
    level: number;
    lifePercent: number;
}

export interface HeroType {
    name: string;
    life: number;
    defense: number;
    level: number;
    attacks: number[];
}

export interface StoreType {
    hero: HeroType;
    enemy: null | EnemyType;
    battleLog: string[];
    attack: (attackID: number) => void;
    lutar: () => void;
    endBattle: () => void;
}