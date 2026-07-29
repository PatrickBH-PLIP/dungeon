'use client'

import { ArrowLeft, Crown, Lock, Skull, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CoinTag } from '@/components/game/hud'
import { getFloor, TOTAL_FIXED_FLOORS } from '@/lib/game-data'
import { getEclipseFloor, TOTAL_ECLIPSE_FLOORS } from '@/lib/game-data-eclipse'
import type { SaveData } from '@/lib/use-game'

type Props = {
  save: SaveData
  onSelect: (index: number) => void
  onBack: () => void
  onShop: () => void
}

export function MapScreen({ save, onSelect, onBack, onShop }: Props) {
  const totalShown =
    save.selectedTower === 'eclipse'
      ? TOTAL_ECLIPSE_FLOORS
      : Math.max(TOTAL_FIXED_FLOORS, save.unlockedFloor + 1)

  const floors = Array.from({ length: totalShown }, (_, i) =>
    save.selectedTower === 'eclipse'
      ? getEclipseFloor(i + 1)
      : getFloor(i + 1)
  )

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Voltar">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-bold">Mapa da Cripta</h1>
            <p className="text-sm text-muted-foreground">
              Cada andar exige contas mais rápidas e mais difíceis.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CoinTag value={save.coins} label="moedas" />
          <Button variant="outline" onClick={onShop} className="font-serif">
            <Store className="size-4 text-primary" />
            Loja
          </Button>
        </div>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {floors.map((floor) => {
          const unlocked = floor.index <= save.unlockedFloor
          const cleared = floor.index <= save.deepestFloor
          return (
            <li key={floor.index}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onSelect(floor.index)}
                className={`flex w-full flex-col gap-2 rounded-xl border p-4 text-left transition-colors ${
                  unlocked
                    ? 'border-border stone-frame hover:border-primary/60'
                    : 'cursor-not-allowed border-border/60 bg-card/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {floor.subtitle}
                  </span>
                  {!unlocked ? (
                    <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
                  ) : cleared ? (
                    <Crown className="size-4 text-primary" aria-hidden="true" />
                  ) : floor.isBoss ? (
                    <Skull className="size-4 text-accent" aria-hidden="true" />
                  ) : null}
                </div>
                <span className="font-serif text-lg font-bold leading-tight">{floor.name}</span>
                <span className="text-sm text-muted-foreground">
                  {floor.monsterName} · {floor.ops.join(' ')} · {floor.timePerQuestion}s base
                </span>
                {!unlocked ? (
                  <span className="text-xs text-muted-foreground">
                    Vença o andar anterior para abrir a passagem.
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
