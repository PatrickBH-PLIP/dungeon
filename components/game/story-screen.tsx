'use client'

import { ArrowLeft, Heart, Skull, Swords, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getFloor } from '@/lib/game-data'
import { getEclipseFloor } from '@/lib/game-data-eclipse'
import type { PlayerStats } from '@/lib/upgrades'
import type { SaveData } from '@/lib/use-game'

type Props = {
  save: SaveData
  floorIndex: number
  stats: PlayerStats
  onStart: () => void
  onBack: () => void
}

export function StoryScreen({ save, floorIndex, stats, onStart, onBack }: Props) {
  const floor =
    save.selectedTower === 'eclipse'
      ? getEclipseFloor(floorIndex)
      : getFloor(floorIndex)
  const time = (floor.timePerQuestion + stats.timeBonus).toFixed(1)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-12">
      <div className="w-full rounded-xl border border-border stone-frame p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
            {floor.subtitle}
          </span>
          {floor.isBoss ? (
            <span className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
              <Skull className="size-3.5" />
              Guardião
            </span>
          ) : null}
        </div>

        <h1 className="mt-2 font-serif text-3xl font-bold text-balance sm:text-4xl">
          {floor.name}
        </h1>
        <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{floor.story}</p>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
          <img
            src={floor.monsterImage || '/placeholder.svg'}
            alt={floor.monsterName}
            className="h-40 w-auto animate-float object-contain drop-shadow-[0_14px_24px_oklch(0_0_0/0.7)]"
          />
          <ul className="flex-1 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Swords className="size-4 text-primary" aria-hidden="true" />
              {floor.monsterName} · {floor.hits} acertos para derrotar
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Timer className="size-4 text-primary" aria-hidden="true" />
              {time}s por conta
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Heart className="size-4 text-accent" aria-hidden="true" />
              {stats.maxLives} de vida · dano do inimigo: {floor.damage}
            </li>
            <li className="text-muted-foreground">
              Operações deste andar:{' '}
              <span className="font-serif font-semibold text-foreground">
                {floor.ops.join('  ')}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex w-full max-w-md gap-3">
        <Button variant="outline" onClick={onBack} className="h-12 flex-1 font-serif">
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <Button
          onClick={onStart}
          className="h-12 flex-[2] font-serif text-base font-bold hover:bg-primary/85"
        >
          <Swords className="size-5" />
          Entrar no combate
        </Button>
      </div>
    </main>
  )
}
