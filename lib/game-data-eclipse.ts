import type { Floor, Op, Question } from './game-data'
import { generateQuestion } from './game-data'


const ECLIPSE_MONSTER = '/images/monster-shadow-spider.png'
const LICH = '/images/monster-lich.png'
const DRAGON = '/images/monster-dragon.png'



type EclipseFloorSeed = {
  name: string
  subtitle: string
  story: string
  monsterName: string
  monsterImage: string
  isBoss?: boolean
  ops: Op[]
  hits: number
  damage: number
  coins: number
}



const ECLIPSE_FLOORS: EclipseFloorSeed[] = [

  {
    name:'Entrada do Eclipse',
    subtitle:'Andar I',
    story:
      'Uma escuridão eterna cobre os degraus. Os números parecem mudar quando você tenta resolvê-los.',
    monsterName:'Guardião Sombrio',
    monsterImage:ECLIPSE_MONSTER,
    ops:['+','-'],
    hits:8,
    damage:2,
    coins:20,
  },


  {
    name:'Salão das Sombras',
    subtitle:'Andar II',
    story:
      'As sombras ganham forma e atacam qualquer aventureiro que erre um cálculo.',
    monsterName:'Aranha Eclipse',
    monsterImage:ECLIPSE_MONSTER,
    ops:['+','-','×'],
    hits:12,
    damage:2,
    coins:30,
  },


  {
    name:'Câmara do Vazio',
    subtitle:'Andar III',
    story:
      'O vazio consome tudo. Apenas cálculos perfeitos permitem continuar.',
    monsterName:'Lich Eclipse',
    monsterImage:LICH,
    ops:['+','-','×','÷'],
    hits:15,
    damage:3,
    coins:40,
  },


  {
    name:'Trono do Eclipse',
    subtitle:'Andar IV',
    story:
      'A criatura que controla a torre finalmente aparece.',
    monsterName:'Dragão do Eclipse',
    monsterImage:DRAGON,
    isBoss:true,
    ops:['+','-','×','÷'],
    hits:25,
    damage:4,
    coins:60,
  },

]





export function getEclipseFloor(index:number):Floor {


  const floor =
    ECLIPSE_FLOORS[index - 1]



  const data = floor ?? {

    name:'Abismo Eclipse',

    subtitle:`Andar ${index}`,

    story:
      'A torre continua sem fim. Cada andar cria desafios mais difíceis.',

    monsterName:'Sombra Infinita',

    monsterImage:ECLIPSE_MONSTER,

    ops:['+','-','×','÷'] as Op[],

    isBoss:index % 5 === 0,

    hits:25,

    damage:4,

    coins:80,

  }



  return {

    index,

    name:data.name,

    subtitle:data.subtitle,

    story:data.story,

    monsterName:data.monsterName,

    monsterImage:data.monsterImage,

    isBoss:Boolean(data.isBoss),

    ops:data.ops,

    hits:data.hits,

    timePerQuestion:25,

    damage:data.damage,

    coinsPerHit:data.coins,

  }

}







export function generateEclipseQuestion(
  floorIndex:number,
  isBoss:boolean = false
):Question {



  // ============================
  // BOSS ECLIPSE
  // EQUAÇÃO
  // ============================


  if(isBoss){


    const answer =
      Math.floor(Math.random()*30)+5



    const add =
      Math.floor(Math.random()*20)+5



    const total =
      answer + add



    return {

      a:answer,

      b:add,

      op:'+',

      answer,

      key:`equation-${answer}-${add}`,

      type:'equation',

      text:`x + ${add} = ${total}`

    }

  }







  const chance =
    Math.random()





  // ============================
  // EXPRESSÃO ECLIPSE
  // ============================


  if(chance < 0.7){


    const a =
      Math.floor(Math.random()*15)+2


    const b =
      Math.floor(Math.random()*10)+2


    const c =
      Math.floor(Math.random()*8)+2



    return {

      a,

      b,

      op:'×',

      answer:
        a + b * c,

      key:
        `expression-${a}-${b}-${c}`,

      type:'expression',

      text:
        `${a} + ${b} × ${c} = ?`

    }

  }







  // ============================
  // CONTA NORMAL
  // ============================


  return generateQuestion(
    floorIndex,
    ['+','-','×','÷']
  )

}





export const TOTAL_ECLIPSE_FLOORS =
  ECLIPSE_FLOORS.length
