export type UpgradeId =
  | 'hourglass'
  | 'vitality'
  | 'ward'
  | 'purse'
  | 'blade'
  | 'freeze'
  | 'oracle'
  | 'talisman'

export type UpgradeKind = 'passiva' | 'habilidade'

export type Upgrade = {
  id: UpgradeId
  name: string
  kind: UpgradeKind
  icon: string
  description: string
  maxLevel: number
  baseCost: number
  growth: number
  effect: (level: number) => string
}

export const UPGRADES: Upgrade[] = [
  {
    id: 'hourglass',
    name: 'Ampulheta Rúnica',
    kind: 'passiva',
    icon: 'hourglass',
    description: 'Areia encantada estica cada segundo dentro da Cripta.',
    maxLevel: 8,
    baseCost: 420,
    growth: 2.1,
    effect: (l) => `+${(l * 1.5).toFixed(1)}s por conta`,
  },
  {
    id: 'vitality',
    name: 'Coração de Pedra',
    kind: 'passiva',
    icon: 'heart',
    description: 'Um fragmento do Golem batendo no seu peito. Aguenta mais golpes.',
    maxLevel: 6,
    baseCost: 380,
    growth: 2.1,
    effect: (l) => `+${l} ponto${l > 1 ? 's' : ''} de vida máxima`,
  },
  {
    id: 'ward',
    name: 'Escudo Arcano',
    kind: 'passiva',
    icon: 'shield',
    description: 'Selo de proteção que às vezes anula o dano de uma resposta errada.',
    maxLevel: 5,
    baseCost: 360,
    growth: 2.1,
    effect: (l) => `${l * 9}% de chance de bloquear dano`,
  },
  {
    id: 'blade',
    name: 'Lâmina Afiada',
    kind: 'passiva',
    icon: 'sword',
    description: 'Acertos podem virar golpes críticos: dano dobrado e moedas extras.',
    maxLevel: 5,
    baseCost: 330,
    growth: 2.1,
    effect: (l) => `${l * 7}% de chance de crítico`,
  },
  {
    id: 'purse',
    name: 'Bolsa do Mercador',
    kind: 'passiva',
    icon: 'coins',
    description: 'Costurada com fios de ouro: cada acerto rende mais moedas.',
    maxLevel: 5,
    baseCost: 350,
    growth: 2.1,
    effect: (l) => `+${l * 18}% de moedas`,
  },
  {
    id: 'freeze',
    name: 'Ampulheta Congelada',
    kind: 'habilidade',
    icon: 'snowflake',
    description: 'Habilidade [Q]: congela o cronômetro por 6 segundos.',
    maxLevel: 3,
    baseCost: 1500,
    growth: 2.1,
    effect: (l) => `${l} uso${l > 1 ? 's' : ''} por andar`,
  },
  {
    id: 'oracle',
    name: 'Olho do Oráculo',
    kind: 'habilidade',
    icon: 'eye',
    description: 'Habilidade [W]: revela pistas sobre a resposta da conta atual.',
    maxLevel: 3,
    baseCost: 480,
    growth: 2.1,
    effect: (l) => `${l} uso${l > 1 ? 's' : ''} por andar`,
  },
  {
    id: 'talisman',
    name: 'Talismã da Alma',
    kind: 'habilidade',
    icon: 'sparkles',
    description: 'Ao cair, revive automaticamente com 2 pontos de vida.',
    maxLevel: 2,
    baseCost: 4800,
    growth: 5,
    effect: (l) => `${l} ressurreição${l > 1 ? 'ões' : ''} por andar`,
  },
]

export type UpgradeLevels = Record<UpgradeId, number>

export const EMPTY_UPGRADES: UpgradeLevels = {
  hourglass: 0,
  vitality: 0,
  ward: 0,
  purse: 0,
  blade: 0,
  freeze: 0,
  oracle: 0,
  talisman: 0,
}

export function upgradeCost(upgrade: Upgrade, currentLevel: number) {
  return Math.round(upgrade.baseCost * Math.pow(upgrade.growth, currentLevel))
}

export const BASE_LIVES = 3

export type PlayerStats = {
  maxLives: number
  timeBonus: number
  blockChance: number
  critChance: number
  coinMultiplier: number
  freezeUses: number
  oracleUses: number
  reviveUses: number
}

export function computeStats(levels: UpgradeLevels): PlayerStats {
  return {
    maxLives: BASE_LIVES + levels.vitality,
    timeBonus: levels.hourglass * 1.5,
    blockChance: levels.ward * 0.09,
    critChance: levels.blade * 0.07,
    coinMultiplier: 1 + levels.purse * 0.18,
    freezeUses: levels.freeze,
    oracleUses: levels.oracle,
    reviveUses: levels.talisman,
  }
}
