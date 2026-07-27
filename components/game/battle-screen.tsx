'use client'

import { useEffect } from 'react'
import { Eye, LogOut, Snowflake, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CoinTag, ComboTag, Hearts, MonsterHealth, TimerBar } from '@/components/game/hud'
import { Numpad } from '@/components/game/numpad'
import { allowsNegative } from '@/lib/game-data'
import type { Battle, Toast } from '@/lib/use-game'

type Props = {
  battle: Battle
  toasts: Toast[]
  onDigit: (d: string) => void
  onBackspace: () => void
  onClear: () => void
  onToggleNegative: () => void
  onSubmit: () => void
  onFreeze: () => void
  onOracle: () => void
  onFlee: () => void
}

export function BattleScreen({
  battle,
  toasts,
  onDigit,
  onBackspace,
  onClear,
  onToggleNegative,
  onSubmit,
  onFreeze,
  onOracle,
  onFlee,
}: Props) {
  const { question, phase, floor } = battle
  const locked = phase !== 'asking'
  const canNegative = allowsNegative(floor.index)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const numpadDigit = /^Numpad([0-9])$/.exec(e.code)
      if (numpadDigit) {
        e.preventDefault()
        onDigit(numpadDigit[1])
        return
      }
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        onDigit(e.key)
        return
      }
      if (e.key === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault()
        onSubmit()
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        onBackspace()
        return
      }
      if (e.key === 'Escape' || e.key === 'Delete' || e.code === 'NumpadDecimal') {
        e.preventDefault()
        onClear()
        return
      }
      if (e.key === '-' || e.code === 'NumpadSubtract') {
        e.preventDefault()
        onToggleNegative()
        return
      }
      if (e.key.toLowerCase() === 'q') {
        e.preventDefault()
        onFreeze()
        return
      }
      if (e.key.toLowerCase() === 'w') {
        e.preventDefault()
        onOracle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBackspace, onClear, onDigit, onFreeze, onOracle, onSubmit, onToggleNegative])

  const display = battle.input === '' ? '' : `${battle.negative ? '-' : ''}${battle.input}`

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border stone-frame px-4 py-3">
        <div className="flex items-center gap-3">
          <Swords className="size-5 text-primary" aria-hidden="true" />
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              {floor.subtitle}
              {floor.isBoss ? ' · Guardião' : ''}
            </p>
            <h1 className="font-serif text-lg font-bold leading-tight">{floor.name}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ComboTag combo={battle.combo} />
          <Hearts lives={battle.lives} maxLives={battle.maxLives} />
          <CoinTag value={battle.coins} label="no andar" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onFlee}
            className="text-muted-foreground hover:text-accent"
          >
            <LogOut className="size-4" />
            Fugir
          </Button>
        </div>
      </header>

      <div className="grid flex-1 items-stretch gap-5 lg:grid-cols-[1fr_1fr]">
        {/* Arena */}
        <section
          aria-label="Arena de combate"
          className="relative flex flex-col items-center justify-end gap-5 overflow-hidden rounded-xl border border-border stone-frame p-5"
        >
          <div className="pointer-events-none absolute inset-x-0 top-4 flex flex-col items-center gap-1">
            {toasts.map((t) => (
              <span
                key={t.id}
                className={`animate-rise font-serif text-lg font-bold ${
                  t.tone === 'good'
                    ? 'text-primary'
                    : t.tone === 'bad'
                      ? 'text-accent'
                      : 'text-foreground'
                }`}
              >
                {t.text}
              </span>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-center">
            <img
              key={battle.shakeAt}
              src={floor.monsterImage || '/placeholder.svg'}
              alt={floor.monsterName}
              className={`max-h-72 w-auto object-contain drop-shadow-[0_18px_28px_oklch(0_0_0/0.7)] ${
                phase === 'wrong' || phase === 'lost' ? 'animate-hit' : 'animate-float'
              }`}
            />
          </div>

          <MonsterHealth
            hp={battle.monsterHp}
            hpMax={battle.monsterHpMax}
            name={floor.monsterName}
          />

          <p
            aria-live="polite"
            className={`min-h-6 text-center text-sm ${
              phase === 'wrong'
                ? 'text-accent'
                : phase === 'correct'
                  ? 'text-primary'
                  : 'text-muted-foreground'
            }`}
          >
            {phase === 'wrong' && battle.lastAnswer !== null
              ? `A resposta certa era ${battle.lastAnswer}. Você levou um golpe!`
              : phase === 'correct'
                ? 'Golpe certeiro! O guardião recua.'
                : phase === 'won'
                  ? 'O guardião desmorona em pó.'
                  : phase === 'lost'
                    ? 'Você tomba no chão frio da cripta...'
                    : 'Resolva a runa para atacar.'}
          </p>
        </section>

        {/* Painel de runas */}
        <section
          aria-label="Runa matemática"
          className="flex flex-col gap-4 rounded-xl border border-border stone-frame p-5"
        >
          <div className="rounded-lg border border-primary/25 bg-background/50 px-4 py-6 text-center">
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              Runa de combate
            </p>
            <p className="mt-2 font-serif text-4xl font-bold tabular-nums text-glow sm:text-5xl">
              {question.a} {question.op} {question.b}
            </p>
          </div>

          <div
            className={`flex h-16 items-center justify-center rounded-lg border-2 bg-secondary/60 px-4 font-serif text-3xl font-bold tabular-nums transition-colors ${
              phase === 'correct'
                ? 'border-primary text-primary'
                : phase === 'wrong'
                  ? 'border-accent text-accent'
                  : 'border-border text-foreground'
            }`}
            aria-live="polite"
            aria-label="Sua resposta"
          >
            {display === '' ? (
              <span className="text-xl font-normal text-muted-foreground">
                digite sua resposta
              </span>
            ) : (
              display
            )}
          </div>

          <TimerBar timeLeft={battle.timeLeft} timeMax={battle.timeMax} frozen={battle.frozen} />

          {battle.hint ? (
            <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-center text-xs text-primary">
              Oráculo: {battle.hint}
            </p>
          ) : null}

          <Numpad
            onDigit={onDigit}
            onBackspace={onBackspace}
            onClear={onClear}
            onToggleNegative={onToggleNegative}
            onSubmit={onSubmit}
            allowNegative={canNegative}
            negative={battle.negative}
            disabled={locked}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onFreeze}
              disabled={locked || battle.freezeLeft <= 0 || battle.frozen}
              className="h-11 flex-1 justify-between"
            >
              <span className="flex items-center gap-2">
                <Snowflake className="size-4 text-primary" />
                Congelar
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">
                [Q] {battle.freezeLeft}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={onOracle}
              disabled={locked || battle.oracleLeft <= 0 || Boolean(battle.hint)}
              className="h-11 flex-1 justify-between"
            >
              <span className="flex items-center gap-2">
                <Eye className="size-4 text-primary" />
                Oráculo
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">
                [W] {battle.oracleLeft}
              </span>
            </Button>
          </div>

          <p className="text-center text-[0.7rem] text-muted-foreground">
            Teclado numérico (Num Lock ligado ou desligado), Enter para atacar, Backspace apaga,
            Esc limpa
            {canNegative ? ', tecla - para resposta negativa' : ''}.
          </p>
        </section>
      </div>
    </main>
  )
}
