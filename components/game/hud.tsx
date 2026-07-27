'use client'

import { Coins, Flame, Heart, Snowflake, Timer } from 'lucide-react'

export function Hearts({ lives, maxLives }: { lives: number; maxLives: number }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${lives} de ${maxLives} vidas`}>
      {Array.from({ length: maxLives }).map((_, i) => (
        <Heart
          key={i}
          className={
            i < lives
              ? 'size-5 fill-accent text-accent drop-shadow-[0_0_6px_color-mix(in_oklab,var(--accent)_60%,transparent)]'
              : 'size-5 text-muted-foreground/40'
          }
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function CoinTag({ value, label }: { value: number; label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-card/80 px-3 py-1.5">
      <Coins className="size-4 text-primary" aria-hidden="true" />
      <span className="font-serif text-base font-semibold tabular-nums text-primary">
        {value.toLocaleString('pt-BR')}
      </span>
      {label ? <span className="text-xs text-muted-foreground">{label}</span> : null}
    </div>
  )
}

export function ComboTag({ combo }: { combo: number }) {
  if (combo < 2) return null
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/15 px-3 py-1.5">
      <Flame className="size-4 text-primary animate-torch" aria-hidden="true" />
      <span className="font-serif text-sm font-bold text-primary">Combo x{combo}</span>
    </div>
  )
}

export function TimerBar({
  timeLeft,
  timeMax,
  frozen,
}: {
  timeLeft: number
  timeMax: number
  frozen: boolean
}) {
  const pct = Math.max(0, Math.min(100, (timeLeft / timeMax) * 100))
  const danger = pct < 30

  return (
    <div className="flex items-center gap-3">
      {frozen ? (
        <Snowflake className="size-4 shrink-0 text-primary animate-torch" aria-hidden="true" />
      ) : (
        <Timer
          className={`size-4 shrink-0 ${danger ? 'text-accent' : 'text-muted-foreground'}`}
          aria-hidden="true"
        />
      )}
      <div
        className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label="Tempo restante"
        aria-valuemin={0}
        aria-valuemax={Math.round(timeMax)}
        aria-valuenow={Math.ceil(timeLeft)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-100 ease-linear ${
            frozen ? 'bg-primary/70' : danger ? 'bg-accent' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`w-12 text-right font-serif text-sm font-semibold tabular-nums ${
          danger ? 'text-accent' : 'text-muted-foreground'
        }`}
      >
        {timeLeft.toFixed(1)}s
      </span>
    </div>
  )
}

export function MonsterHealth({ hp, hpMax, name }: { hp: number; hpMax: number; name: string }) {
  const pct = (hp / hpMax) * 100
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="font-serif text-sm font-semibold tracking-wide text-foreground">
          {name}
        </span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {hp}/{hpMax}
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full border border-border bg-secondary"
        role="progressbar"
        aria-label={`Vida de ${name}`}
        aria-valuemin={0}
        aria-valuemax={hpMax}
        aria-valuenow={hp}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
