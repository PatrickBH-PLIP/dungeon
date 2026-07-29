'use client'

import { BattleScreen } from '@/components/game/battle-screen'
import { DungeonBackdrop } from '@/components/game/dungeon-backdrop'
import { MapScreen } from '@/components/game/map-screen'
import { ResultScreen } from '@/components/game/result-screen'
import { ShopScreen } from '@/components/game/shop-screen'
import { StoryScreen } from '@/components/game/story-screen'
import { TitleScreen } from '@/components/game/title-screen'
import { useGame } from '@/lib/use-game'

export function GameShell() {
  const game = useGame()
  const battle = game.battle

  if (!game.loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-serif text-lg text-muted-foreground">Acendendo as tochas...</p>
      </main>
    )
  }

  return (
    <>
      <DungeonBackdrop />

      <div className="relative z-10">
      {game.screen === 'menu' ? (
        <TitleScreen
          save={game.save}
          onContinue={() => game.openFloor(game.save.unlockedFloor)}
          onMap={() => game.setScreen('map')}
          onShop={() => game.setScreen('shop')}
          onReset={game.resetSave}
          onSelectTower={game.selectTower}
      />
      ) : null}

      {game.screen === 'map' ? (
        <MapScreen
          save={game.save}
          onSelect={game.openFloor}
          onBack={() => game.setScreen('menu')}
          onShop={() => game.setScreen('shop')}
        />
      ) : null}

      {game.screen === 'shop' ? (
        <ShopScreen
          coins={game.save.coins}
          upgrades={game.save.upgrades}
          onBuy={game.buyUpgrade}
          onBack={() => game.setScreen('menu')}
        />
      ) : null}

      {game.screen === 'story' ? (
        <StoryScreen
          floorIndex={game.pendingFloor}
          stats={game.stats}
          onStart={() => game.startBattle(game.pendingFloor)}
          onBack={() => game.setScreen('menu')}
        />
      ) : null}

      {game.screen === 'battle' && battle ? (
        <BattleScreen
          battle={battle}
          toasts={game.toasts}
          onDigit={game.typeDigit}
          onBackspace={game.backspace}
          onClear={game.clearInput}
          onToggleNegative={game.toggleNegative}
          onSubmit={game.submit}
          onFreeze={game.useFreeze}
          onOracle={game.useOracle}
          onFlee={game.flee}
        />
      ) : null}

      {game.screen === 'result' && battle ? (
        <ResultScreen
          battle={battle}
          onRetry={() => game.startBattle(battle.floor.index)}
          onNext={() => game.openFloor(battle.floor.index + 1)}
          onShop={() => game.setScreen('shop')}
          onMenu={() => game.setScreen('menu')}
        />
      ) : null}
      </div>
    </>
  )
}
