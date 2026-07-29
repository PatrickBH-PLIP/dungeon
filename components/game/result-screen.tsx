'use client'

import { ChevronRight, Home, RotateCcw, Store, Trophy, Skull } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getFloor } from '@/lib/game-data'
import { getEclipseFloor } from '@/lib/game-data-eclipse'
import type { Battle } from '@/lib/use-game'

type Props = {
  battle: Battle
  selectedTower: 'crypt' | 'eclipse'
  onRetry: () => void
  onNext: () => void
  onShop: () => void
  onMenu: () => void
}

export function ResultScreen({
  battle,
  selectedTower,
  onRetry,
  onNext,
  onShop,
  onMenu,
}: Props) {
  const won = battle.phase === 'won'
  const total = battle.correct + battle.wrong
  const accuracy = total > 0 ? Math.round((battle.correct / total) * 100) : 0
  const nextFloor =
    selectedTower === 'eclipse'
      ? getEclipseFloor(battle.floor.index + 1)
      : getFloor(battle.floor.index + 1)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <div className="w-full rounded-xl border border-border stone-frame p-6 sm:p-8">
        <span
          className={`mx-auto flex size-16 items-center justify-center rounded-full border ${
            won ? 'border-primary/40 bg-primary/15' : 'border-accent/40 bg-accent/15'
          }`}
        >
          {won ? (
            <Trophy className="size-8 text-primary" aria-hidden="true" />
          ) : (
            <Skull className="size-8 text-accent" aria-hidden="true" />
          )}
        </span>

        <h1 className="mt-4 font-serif text-3xl font-bold text-balance">
          {won ? `${battle.floor.name} selado!` : 'Você caiu na escuridão'}
        </h1>
        <p className="mt-2 leading-relaxed text-pretty text-muted-foreground">
          {won
            ? `${battle.floor.monsterName} virou pó e a runa do andar voltou a brilhar. A passagem para ${nextFloor.name} está aberta.`
            : `${battle.floor.monsterName} foi mais rápido que seus cálculos. Todas as moedas deste andar se perderam na escuridão — melhore seu equipamento e volte.`}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Moedas</dt>
            <dd className="font-serif text-lg font-bold tabular-nums text-primary">
              +{battle.coins}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Acertos</dt>
            <dd className="font-serif text-lg font-bold tabular-nums">{battle.correct}</dd>
          </div>
          <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Erros</dt>
            <dd className="font-serif text-lg font-bold tabular-nums">{battle.wrong}</dd>
          </div>
          <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Precisão</dt>
            <dd className="font-serif text-lg font-bold tabular-nums">{accuracy}%</dd>
          </div>
        </dl>

        {battle.bestCombo > 1 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Melhor sequência:{' '}
            <span className="font-serif font-semibold text-primary">
              {battle.bestCombo} acertos
            </span>
          </p>
        ) : null}
      </div>

      <div className="flex w-full max-w-md flex-col gap-3">
        {won ? (
          <Button
            onClick={onNext}
            className="h-13 justify-between px-5 font-serif text-base font-bold hover:bg-primary/85"
          >
            <span>Descer para {nextFloor.subtitle}</span>
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={onRetry}
            className="h-13 justify-center px-5 font-serif text-base font-bold hover:bg-primary/85"
          >
            <RotateCcw className="size-4" />
            Tentar o andar de novo
          </Button>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onShop} className="h-11 flex-1 font-serif">
            <Store className="size-4 text-primary" />
            Loja
          </Button>
          <Button variant="outline" onClick={onMenu} className="h-11 flex-1 font-serif">
            <Home className="size-4 text-primary" />
            Entrada
          </Button>
        </div>
      </div>
    </main>
  )
}
