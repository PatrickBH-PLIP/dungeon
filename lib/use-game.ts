'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  generateQuestion,
  getFloor,
  oracleHint,
  type Floor,
  type Question,
} from '@/lib/game-data'
import {
  computeStats,
  EMPTY_UPGRADES,
  UPGRADES,
  upgradeCost,
  type UpgradeId,
  type UpgradeLevels,
} from '@/lib/upgrades'

const SAVE_KEY = 'cripta-dos-numeros:v1'

export type Screen = 'menu' | 'story' | 'battle' | 'result' | 'shop' | 'map'
export type Phase = 'asking' | 'correct' | 'wrong' | 'won' | 'lost'

export type SaveData = {
  coins: number
  upgrades: UpgradeLevels
  unlockedFloor: number
  deepestFloor: number
  totalCorrect: number
  totalWrong: number
}

const DEFAULT_SAVE: SaveData = {
  coins: 0,
  upgrades: { ...EMPTY_UPGRADES },
  unlockedFloor: 1,
  deepestFloor: 0,
  totalCorrect: 0,
  totalWrong: 0,
}

export type Toast = { id: number; text: string; tone: 'good' | 'bad' | 'info' }

export type Battle = {
  floor: Floor
  monsterHpMax: number
  monsterHp: number
  lives: number
  maxLives: number
  question: Question
  timeMax: number
  timeLeft: number
  input: string
  negative: boolean
  phase: Phase
  combo: number
  bestCombo: number
  coins: number
  correct: number
  wrong: number
  freezeLeft: number
  oracleLeft: number
  revivesLeft: number
  hint: string | null
  frozen: boolean
  lastAnswer: number | null
  shakeAt: number
}

export function useGame() {
  const [save, setSave] = useState<SaveData>(DEFAULT_SAVE)
  const [loaded, setLoaded] = useState(false)
  const [screen, setScreen] = useState<Screen>('menu')
  const [pendingFloor, setPendingFloor] = useState(1)
  const [battle, setBattle] = useState<Battle | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const committedRef = useRef(false)
  const toastId = useRef(0)
  const battleRef = useRef<Battle | null>(null)

  useEffect(() => {
    battleRef.current = battle
  }, [battle])

  /* ---------- persistência ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as SaveData
        setSave({
          ...DEFAULT_SAVE,
          ...parsed,
          upgrades: { ...EMPTY_UPGRADES, ...parsed.upgrades },
        })
      }
    } catch {
      /* save corrompido: começa do zero */
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save))
    } catch {
      /* armazenamento indisponível */
    }
  }, [save, loaded])

  const stats = computeStats(save.upgrades)

  const pushToast = useCallback((text: string, tone: Toast['tone']) => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, text, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1100)
  }, [])

  /* ---------- fluxo de telas ---------- */
  const openFloor = useCallback((index: number) => {
    setPendingFloor(index)
    setScreen('story')
  }, [])

  const startBattle = useCallback(
    (index: number) => {
      const floor = getFloor(index)
      const timeMax = floor.timePerQuestion + stats.timeBonus
      committedRef.current = false
      setBattle({
        floor,
        monsterHpMax: floor.hits,
        monsterHp: floor.hits,
        lives: stats.maxLives,
        maxLives: stats.maxLives,
        question: generateQuestion(index, floor.ops),
        timeMax,
        timeLeft: timeMax,
        input: '',
        negative: false,
        phase: 'asking',
        combo: 0,
        bestCombo: 0,
        coins: 0,
        correct: 0,
        wrong: 0,
        freezeLeft: stats.freezeUses,
        oracleLeft: stats.oracleUses,
        revivesLeft: stats.reviveUses,
        hint: null,
        frozen: false,
        lastAnswer: null,
        shakeAt: 0,
      })
      setScreen('battle')
    },
    [stats.freezeUses, stats.maxLives, stats.oracleUses, stats.reviveUses, stats.timeBonus],
  )

  /* ---------- cronômetro ---------- */
  useEffect(() => {
    if (screen !== 'battle') return
    const id = setInterval(() => {
      setBattle((b) => {
        if (!b || b.phase !== 'asking' || b.frozen) return b
        return { ...b, timeLeft: Math.max(0, +(b.timeLeft - 0.1).toFixed(1)) }
      })
    }, 100)
    return () => clearInterval(id)
  }, [screen])

  /* ---------- resolução da resposta ---------- */
  const resolve = useCallback(
    (value: number | null) => {
      setBattle((b) => {
        if (!b || b.phase !== 'asking') return b
        const isCorrect = value !== null && value === b.question.answer

        if (isCorrect) {
          const crit = Math.random() < stats.critChance
          const dmg = crit ? 2 : 1
          const combo = b.combo + 1
          const comboBonus = 1 + Math.min(combo - 1, 5) * 0.1
          const gain = Math.round(
            b.floor.coinsPerHit * comboBonus * stats.coinMultiplier * (crit ? 1.5 : 1),
          )
          const monsterHp = Math.max(0, b.monsterHp - dmg)
          pushToast(crit ? `CRÍTICO! +${gain} moedas` : `+${gain} moedas`, 'good')
          return {
            ...b,
            monsterHp,
            coins: b.coins + gain,
            combo,
            bestCombo: Math.max(b.bestCombo, combo),
            correct: b.correct + 1,
            phase: monsterHp <= 0 ? 'won' : 'correct',
            input: '',
            negative: false,
            hint: null,
            lastAnswer: b.question.answer,
          }
        }

        const blocked = Math.random() < stats.blockChance
        let lives = blocked ? b.lives : Math.max(0, b.lives - b.floor.damage)
        let revivesLeft = b.revivesLeft
        if (lives <= 0 && revivesLeft > 0) {
          revivesLeft -= 1
          lives = 2
          pushToast('Talismã da Alma ativado!', 'info')
        } else if (blocked) {
          pushToast('Escudo Arcano bloqueou!', 'info')
        } else {
          pushToast(value === null ? 'Tempo esgotado!' : 'Errado!', 'bad')
        }

        return {
          ...b,
          lives,
          revivesLeft,
          combo: 0,
          wrong: b.wrong + 1,
          phase: lives <= 0 ? 'lost' : 'wrong',
          input: '',
          negative: false,
          hint: null,
          lastAnswer: b.question.answer,
          shakeAt: Date.now(),
        }
      })
    },
    [pushToast, stats.blockChance, stats.coinMultiplier, stats.critChance],
  )

  /* ---------- tempo esgotado ---------- */
  useEffect(() => {
    if (battle && battle.phase === 'asking' && battle.timeLeft <= 0) resolve(null)
  }, [battle, resolve])

  /* ---------- próxima pergunta ---------- */
  useEffect(() => {
    if (!battle) return
    if (battle.phase !== 'correct' && battle.phase !== 'wrong') return
    const delay = battle.phase === 'correct' ? 450 : 1300
    const id = setTimeout(() => {
      setBattle((b) => {
        if (!b || (b.phase !== 'correct' && b.phase !== 'wrong')) return b
        return {
          ...b,
          question: generateQuestion(b.floor.index, b.floor.ops, b.question.key),
          timeLeft: b.timeMax,
          phase: 'asking',
          lastAnswer: null,
        }
      })
    }, delay)
    return () => clearTimeout(id)
  }, [battle?.phase, battle])

  /* ---------- fim do andar ---------- */
  useEffect(() => {
    if (!battle) return
    if (battle.phase !== 'won' && battle.phase !== 'lost') return
    if (committedRef.current) return
    committedRef.current = true
    const won = battle.phase === 'won'
    setSave((s) => ({
      ...s,
      coins: won ? s.coins + battle.coins : s.coins,
      totalCorrect: s.totalCorrect + battle.correct,
      totalWrong: s.totalWrong + battle.wrong,
      unlockedFloor: won ? Math.max(s.unlockedFloor, battle.floor.index + 1) : s.unlockedFloor,
      deepestFloor: won ? Math.max(s.deepestFloor, battle.floor.index) : s.deepestFloor,
    }))
    const id = setTimeout(() => setScreen('result'), 900)
    return () => clearTimeout(id)
  }, [battle?.phase, battle])

  /* ---------- entrada numérica ---------- */
  const typeDigit = useCallback((d: string) => {
    setBattle((b) => {
      if (!b || b.phase !== 'asking') return b
      if (b.input.replace('-', '').length >= 6) return b
      return { ...b, input: b.input + d }
    })
  }, [])

  const backspace = useCallback(() => {
    setBattle((b) => (b && b.phase === 'asking' ? { ...b, input: b.input.slice(0, -1) } : b))
  }, [])

  const clearInput = useCallback(() => {
    setBattle((b) => (b && b.phase === 'asking' ? { ...b, input: '', negative: false } : b))
  }, [])

  const toggleNegative = useCallback(() => {
    setBattle((b) => (b && b.phase === 'asking' ? { ...b, negative: !b.negative } : b))
  }, [])

  const submit = useCallback(() => {
    const b = battleRef.current
    if (!b || b.phase !== 'asking' || b.input === '') return
    resolve(Number(b.input) * (b.negative ? -1 : 1))
  }, [resolve])

  /* ---------- habilidades ---------- */
  const useFreeze = useCallback(() => {
    setBattle((b) => {
      if (!b || b.phase !== 'asking' || b.freezeLeft <= 0 || b.frozen) return b
      setTimeout(() => setBattle((x) => (x ? { ...x, frozen: false } : x)), 6000)
      return { ...b, freezeLeft: b.freezeLeft - 1, frozen: true }
    })
    pushToast('Tempo congelado por 6s', 'info')
  }, [pushToast])

  const useOracle = useCallback(() => {
    setBattle((b) => {
      if (!b || b.phase !== 'asking' || b.oracleLeft <= 0 || b.hint) return b
      return { ...b, oracleLeft: b.oracleLeft - 1, hint: oracleHint(b.question.answer) }
    })
  }, [])

  /* ---------- loja ---------- */
  const buyUpgrade = useCallback(
    (id: UpgradeId) => {
      const upgrade = UPGRADES.find((u) => u.id === id)
      if (!upgrade) return
      setSave((s) => {
        const level = s.upgrades[id]
        if (level >= upgrade.maxLevel) return s
        const cost = upgradeCost(upgrade, level)
        if (s.coins < cost) return s
        return { ...s, coins: s.coins - cost, upgrades: { ...s.upgrades, [id]: level + 1 } }
      })
    },
    [],
  )

  const flee = useCallback(() => {
    const b = battleRef.current
    if (b && !committedRef.current) {
      committedRef.current = true
      setSave((s) => ({
        ...s,
        coins: s.coins + b.coins,
        totalCorrect: s.totalCorrect + b.correct,
        totalWrong: s.totalWrong + b.wrong,
      }))
    }
    setBattle(null)
    setScreen('menu')
  }, [])

  const resetSave = useCallback(() => {
    setSave({ ...DEFAULT_SAVE, upgrades: { ...EMPTY_UPGRADES } })
    setBattle(null)
    setScreen('menu')
  }, [])

  return {
    loaded,
    save,
    stats,
    screen,
    setScreen,
    pendingFloor,
    openFloor,
    startBattle,
    battle,
    toasts,
    typeDigit,
    backspace,
    clearInput,
    toggleNegative,
    submit,
    useFreeze,
    useOracle,
    flee,
    buyUpgrade,
    resetSave,
  }
}
