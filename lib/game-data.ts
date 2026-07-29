export type Op = '+' | '-' | '×' | '÷'

export type Question = {
  a: number
  b: number
  op: Op
  answer: number
  key: string

  type?: 'normal' | 'expression' | 'equation'
  text?: string
}

export type Floor = {
  index: number
  name: string
  subtitle: string
  story: string
  monsterName: string
  monsterImage: string
  isBoss: boolean
  ops: Op[]
  hits: number
  timePerQuestion: number
  damage: number
  coinsPerHit: number
}

const RAT = '/images/monster-rat.png'
const SKELETON = '/images/monster-skeleton.png'
const GOLEM = '/images/monster-golem.png'
const LICH = '/images/monster-lich.png'
const DRAGON = '/images/monster-dragon.png'
const OGRE = '/images/monster-ogre.png'
const SHADOW_SPIDER = '/images/monster-shadow-spider.png'

type FloorSeed = {
  name: string
  subtitle: string
  story: string
  monsterName: string
  monsterImage: string
  isBoss?: boolean
  ops: Op[]
  hitsOverride?: number
  damageOverride?: number
  coinsOverride?: number
}

const FLOOR_SEEDS: FloorSeed[] = [
  {
    name: 'Cripta dos Sussurros',
    subtitle: 'Andar I',
    story:
      'As tochas ainda queimam. Algo se arrasta entre os caixões quebrados e repete números que você não entende.',
    monsterName: 'Ratazana da Cripta',
    monsterImage: RAT,
    ops: ['+'],
  },
  {
    name: 'Corredor dos Ossos',
    subtitle: 'Andar II',
    story:
      'Cada passo estala. Os ossos do chão formam contas antigas — resolva-as antes que se levantem.',
    monsterName: 'Ratazana Faminta',
    monsterImage: RAT,
    ops: ['+', '-'],
  },
  {
    name: 'Sala das Correntes',
    subtitle: 'Andar III',
    story:
      'Correntes enferrujadas pendem do teto. Nelas, prisioneiros gravaram somas e diferenças com as unhas.',
    monsterName: 'Sentinela Esquelética',
    monsterImage: SKELETON,
    ops: ['+', '-'],
  },
  {
    name: 'Forja Abandonada',
    subtitle: 'Andar IV',
    story:
      'O ferreiro morto ainda martela. Ele só entrega a chave a quem souber multiplicar suas bigornas.',
    monsterName: 'Guardião de Ferro',
    monsterImage: SKELETON,
    isBoss: true,
    ops: ['+', '-', '×'],
  },
  {
    name: 'Biblioteca Submersa',
    subtitle: 'Andar V',
    story:
      'Água escura cobre os degraus. Livros flutuam abertos, exigindo produtos exatos para não afundarem.',
    monsterName: 'Escriba Afogado',
    monsterImage: SKELETON,
    ops: ['×'],
  },
  {
    name: 'Poço das Runas',
    subtitle: 'Andar VI',
    story:
      'Runas giram no fundo do poço. Dividir é a única forma de partir o selo que prende a porta.',
    monsterName: 'Golem Rúnico',
    monsterImage: GOLEM,
    ops: ['÷', '×'],
  },
  {
    name: 'Catacumba Fria',
    subtitle: 'Andar VII',
    story:
      'O frio rouba o tempo. Aqui os números crescem e o ar fica curto — o negativo passa a existir.',
    monsterName: 'Golem Rachado',
    monsterImage: GOLEM,
    ops: ['+', '-', '×', '÷'],
  },
  {
    name: 'Trono de Pedra',
    subtitle: 'Andar VIII',
    story:
      'No trono, um colosso desperta. Ele mede o valor de um herói pela velocidade do seu cálculo.',
    monsterName: 'Colosso da Cripta',
    monsterImage: GOLEM,
    isBoss: true,
    ops: ['+', '-', '×', '÷'],
  },
  {
    name: 'Laboratório do Necromante',
    subtitle: 'Andar IX',
    story:
      'Frascos borbulham com números vivos. Errar aqui alimenta o que dorme no andar de baixo.',
    monsterName: 'Aprendiz Necrótico',
    monsterImage: LICH,
    ops: ['×', '÷'],
  },
  {
    name: 'Corredor Invertido',
    subtitle: 'Andar X',
    story:
      'O chão é teto. As contas vêm ao contrário e o tempo escorre mais rápido do que deveria.',
    monsterName: 'Sombra Contadora',
    monsterImage: LICH,
    ops: ['+', '-', '×', '÷'],
  },
  {
    name: 'Coração da Cripta',
    subtitle: 'Andar XI',
    story:
      'Um pulso ecoa nas paredes. É o Lich somando cada erro que você já cometeu na descida.',
    monsterName: 'Lich dos Algarismos',
    monsterImage: LICH,
    isBoss: true,
    ops: ['+', '-', '×', '÷'],
  },
  {
    name: 'Abismo do Dragão',
    subtitle: 'Andar XII',
    story:
      'O último degrau. O Dragão Ancião guarda o Cálculo Primordial — a conta que criou a masmorra.',
    monsterName: 'Dragão Ancião',
    monsterImage: DRAGON,
    isBoss: true,
    ops: ['+', '-', '×', '÷'],
  },
  {
    name: 'Covil do Ogro',
    subtitle: 'Andar XIII',
    story:
      'Um cheiro de carne queimada enche o ar. O chão treme a cada passo pesado que se aproxima.',
    monsterName: 'Ogro Grunhidor',
    monsterImage: OGRE,
    ops: ['+', '-'],
    hitsOverride: 6,
    damageOverride: 1,
    coinsOverride: 10,
  },
  {
    name: 'Covil do Ogro',
    subtitle: 'Andar XIV',
    story:
      'O grunhido fica mais grave. Este ogro carrega uma clava manchada de contas erradas de outros aventureiros.',
    monsterName: 'Ogro Selvagem',
    monsterImage: OGRE,
    ops: ['+', '-', '×'],
    hitsOverride: 9,
    damageOverride: 2,
    coinsOverride: 16,
  },
  {
    name: 'Trono do Ogro',
    subtitle: 'Andar XV',
    story:
      'Ossos de outros ogros formam o trono onde ele se senta. Só o cálculo mais rápido o derruba.',
    monsterName: 'Ogro Devastador',
    monsterImage: OGRE,
    isBoss: true,
    ops: ['+', '-', '×', '÷'],
    hitsOverride: 14,
    damageOverride: 3,
    coinsOverride: 26,
  },
  {
    name: 'Teia Rastejante',
    subtitle: 'Andar XVI',
    story:
      'Fios grudentos cobrem as paredes. Algo pequeno e rápido observa de um canto escuro.',
    monsterName: 'Aranha Rastejante',
    monsterImage: SHADOW_SPIDER,
    ops: ['+', '-'],
    hitsOverride: 5,
    damageOverride: 1,
    coinsOverride: 9,
  },
  {
    name: 'Ninho Venenoso',
    subtitle: 'Andar XVII',
    story:
      'O ar fica denso e amargo. As picadas dessa aranha carregam mais que veneno — carregam erros.',
    monsterName: 'Aranha Venenosa',
    monsterImage: SHADOW_SPIDER,
    ops: ['+', '-', '×'],
    hitsOverride: 8,
    damageOverride: 2,
    coinsOverride: 15,
  },
  {
    name: 'Câmara da Mãe das Trevas',
    subtitle: 'Andar XVIII',
    story:
      'Milhares de olhos brilham na escuridão. A Aranha-Mãe tece cálculos como teias, e nenhuma tem saída fácil.',
    monsterName: 'Aranha-Mãe das Trevas',
    monsterImage: SHADOW_SPIDER,
    isBoss: true,
    ops: ['+', '-', '×', '÷'],
    hitsOverride: 15,
    damageOverride: 3,
    coinsOverride: 28,
  },
]

export const TOTAL_FIXED_FLOORS = FLOOR_SEEDS.length

const ROMAN = [
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
  'XXI',
  'XXII',
  'XXIII',
  'XXIV',
]

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function getFloor(index: number): Floor {
  const seed = FLOOR_SEEDS[index - 1]
  const isEndless = !seed
  const depth = index

  const base: FloorSeed = seed ?? {
    name: 'Abismo sem Fim',
    subtitle: `Andar ${ROMAN[index - 13] ?? index}`,
    story:
      'Não há mais mapa. A cada andar, a Cripta inventa contas novas só para ver você falhar.',
    monsterName: 'Eco do Dragão',
    monsterImage: DRAGON,
    isBoss: index % 4 === 0,
    ops: ['+', '-', '×', '÷'],
  }

  const isBoss = Boolean(base.isBoss)

  return {
    index,
    name: base.name,
    subtitle: base.subtitle,
    story: base.story,
    monsterName: base.monsterName,
    monsterImage: base.monsterImage,
    isBoss,
    ops: base.ops,
    hits: base.hitsOverride ?? (clamp(5 + Math.floor(depth / 2), 5, 12) + (isBoss ? 3 : 0)),
    timePerQuestion: clamp(14 - Math.floor(depth / 2), 6, 14) - (isBoss ? 1 : 0),
    damage: base.damageOverride ?? (isBoss ? 2 : 1),
    coinsPerHit: base.coinsOverride ?? (4 + depth * 2 + (isEndless ? 6 : 0)),
  }
}

export const allowsNegative = (floorIndex: number) => floorIndex >= 7

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateQuestion(
  floorIndex: number,
  ops: Op[],
  avoidKey?: string
): Question {

  const d = floorIndex
  let q: Question | null = null

  for (let attempt = 0; attempt < 12; attempt++) {

    const op = pick(ops)

    let a = 0
    let b = 0
    let answer = 0


    if (op === '+') {

      const max = clamp(9 + d * 9, 9, 999)

      a = randInt(2, max)
      b = randInt(2, max)

      answer = a + b


    } else if (op === '-') {

      const max = clamp(9 + d * 9, 9, 999)

      a = randInt(2, max)
      b = randInt(2, max)

      if (!allowsNegative(floorIndex) && b > a) {
        [a,b] = [b,a]
      }

      answer = a - b


    } else if (op === '×') {

      const aMax = clamp(3+d,4,25)
      const bMax = clamp(4+Math.floor(d*1.6),5,40)

      a = randInt(2,aMax)
      b = randInt(2,bMax)

      answer = a*b


    } else {

      const divisor = randInt(2, clamp(2+d,3,15))
      const quotient = randInt(2, clamp(3+d,3,20))

      a = divisor * quotient
      b = divisor

      answer = quotient

    }


    const key = `${a}${op}${b}`


    if(key === avoidKey) continue


    q = {

      a,
      b,
      op,
      answer,
      key,

      type:'normal',

      text:`${a} ${op} ${b} = ?`

    }


    break
  }


  return q ?? {

    a:1,
    b:1,
    op:'+',
    answer:2,
    key:'1+1',

    type:'normal',

    text:'1 + 1 = ?'

  }

}
