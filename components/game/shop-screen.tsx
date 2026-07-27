'use client'

import { ArrowLeft, Check, Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CoinTag } from '@/components/game/hud'
import { UpgradeIcon } from '@/components/game/upgrade-icon'
import { UPGRADES, upgradeCost, type UpgradeId, type UpgradeLevels } from '@/lib/upgrades'

type Props = {
  coins: number
  upgrades: UpgradeLevels
  onBuy: (id: UpgradeId) => void
  onBack: () => void
}

export function ShopScreen({ coins, upgrades, onBuy, onBack }: Props) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Voltar">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-bold">Loja do Mercador Cego</h1>
            <p className="text-sm text-muted-foreground">
              &quot;Eu não vejo você, aprendiz. Mas ouço o peso das suas moedas.&quot;
            </p>
          </div>
        </div>
        <CoinTag value={coins} label="moedas" />
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {UPGRADES.map((upgrade) => {
          const level = upgrades[upgrade.id]
          const maxed = level >= upgrade.maxLevel
          const cost = upgradeCost(upgrade, level)
          const affordable = coins >= cost

          return (
            <li
              key={upgrade.id}
              className="flex flex-col gap-3 rounded-xl border border-border stone-frame p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                  <UpgradeIcon name={upgrade.icon} className="size-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-base font-bold leading-tight">
                      {upgrade.name}
                    </h2>
                  </div>
                  <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {upgrade.kind}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {upgrade.description}
              </p>

              <div className="flex items-center gap-1" aria-label={`Nível ${level} de ${upgrade.maxLevel}`}>
                {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < level ? 'bg-primary' : 'bg-secondary'
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm">
                <span className="text-muted-foreground">Atual: </span>
                <span className="font-serif font-semibold text-foreground">
                  {level > 0 ? upgrade.effect(level) : 'nenhum efeito'}
                </span>
              </p>
              {!maxed ? (
                <p className="text-sm text-primary">Próximo: {upgrade.effect(level + 1)}</p>
              ) : null}

              <Button
                onClick={() => onBuy(upgrade.id)}
                disabled={maxed || !affordable}
                variant={maxed ? 'secondary' : 'default'}
                className="mt-auto h-11 justify-center font-serif font-bold hover:bg-primary/85"
              >
                {maxed ? (
                  <>
                    <Check className="size-4" />
                    Nível máximo
                  </>
                ) : (
                  <>
                    <Coins className="size-4" />
                    {cost.toLocaleString('pt-BR')} moedas
                  </>
                )}
              </Button>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
