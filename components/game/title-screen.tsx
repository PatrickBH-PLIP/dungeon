'use client'

import { ChevronRight, Map, ScrollText, Store, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CoinTag } from '@/components/game/hud'
import { getFloor } from '@/lib/game-data'
import { getEclipseFloor } from '@/lib/game-data-eclipse'
import type { SaveData } from '@/lib/use-game'

type Props = {
  save: SaveData
  onContinue: () => void
  onMap: () => void
  onShop: () => void
  onReset: () => void
  onSelectTower: (tower: 'crypt' | 'eclipse') => void
}

export function TitleScreen({
  save,
  onContinue,
  onMap,
  onShop,
  onReset,
  onSelectTower,
}: Props) {
  const currentUnlocked =
    save.selectedTower === 'crypt'
      ? save.cryptUnlockedFloor
      : save.eclipseUnlockedFloor
  
  const next =
    save.selectedTower === 'eclipse'
      ? getEclipseFloor(currentUnlocked)
      : getFloor(currentUnlocked)
  const total = save.totalCorrect + save.totalWrong
  const accuracy = total > 0 ? Math.round((save.totalCorrect / total) * 100) : 0

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-primary">
          Masmorra matemática
        </span>
        <h1 className="font-serif text-5xl font-black tracking-tight text-glow text-balance sm:text-6xl">
          Cripta dos Números
        </h1>
        <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Há mil anos, o Mestre dos Cálculos selou seus monstros sob o castelo usando runas de
          aritmética. As runas se apagaram. Você é o último aprendiz da Ordem da Régua — desça andar
          por andar, resolve as contas que dão poder aos guardiões e refaça o selo antes que o
          Dragão Ancião chegue à superfície.
        </p>
        <div className="flex w-full max-w-md flex-col gap-3">

  <Button
    variant={save.selectedTower === 'crypt' ? 'default' : 'outline'}
    onClick={() => onSelectTower('crypt')}
    className="h-12 justify-between font-serif"
  >
    <span>🏰 Cripta dos Números</span>
    <span className="text-xs">
      Liberada
    </span>
  </Button>


  <Button
    variant={save.selectedTower === 'eclipse' ? 'default' : 'outline'}
    disabled={!save.eclipseUnlocked}
    onClick={() => onSelectTower('eclipse')}
    className="h-12 justify-between font-serif"
  >
    <span>🌑 Torre do Eclipse Eterno</span>

    <span className="text-xs">
      {save.eclipseUnlocked
        ? 'Liberada'
        : '🔒 Derrote a Mãe das Trevas'}
    </span>

  </Button>

</div>
      </div>

      <div className="flex w-full max-w-md flex-col gap-3">
        <Button
          onClick={onContinue}
          className="h-14 justify-between px-5 font-serif text-lg font-bold hover:bg-primary/85"
        >
          <span className="flex items-center gap-3">
            <ScrollText className="size-5" />
            {save.selectedTower === 'eclipse'
              ? 'Entrar no Eclipse'
              : currentUnlocked > 1
                ? 'Continuar descida'
                : 'Entrar na Cripta'}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium opacity-80">
            {next.subtitle}
            <ChevronRight className="size-4" />
          </span>
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onMap} className="h-12 flex-1 font-serif">
            <Map className="size-4 text-primary" />
            Mapa dos andares
          </Button>
          <Button variant="outline" onClick={onShop} className="h-12 flex-1 font-serif">
            <Store className="size-4 text-primary" />
            Loja do Mercador
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <CoinTag value={save.coins} label="moedas" />
        <div className="rounded-lg border border-border bg-card/80 px-3 py-1.5 text-sm text-muted-foreground">
          Andar mais fundo:{' '}
          <span className="font-serif font-semibold text-foreground">
            {save.selectedTower === 'crypt'
              ? save.cryptDeepestFloor || '—'
              : save.eclipseDeepestFloor || '—'}
          </span>
        </div>
        <div className="rounded-lg border border-border bg-card/80 px-3 py-1.5 text-sm text-muted-foreground">
          Precisão: <span className="font-serif font-semibold text-foreground">{accuracy}%</span>
        </div>
      </div>

      {total > 0 ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-accent"
        >
          <Trash2 className="size-4" />
          Apagar progresso
        </Button>
      ) : null}
    </main>
  )
}
