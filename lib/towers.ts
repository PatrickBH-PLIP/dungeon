export type TowerId = 'crypt' | 'eclipse'

export type Tower = {
  id: TowerId
  name: string
  subtitle: string
  description: string
  totalFloors: number
  unlocked: boolean
}

export const TOWERS: Tower[] = [
  {
    id: 'crypt',
    name: 'Cripta dos Números',
    subtitle: 'Torre Inicial',
    description:
      'A antiga cripta onde aventureiros aprendem os fundamentos da matemática enfrentando monstros e chefes.',
    totalFloors: 18,
    unlocked: true,
  },

  {
    id: 'eclipse',
    name: 'Torre do Eclipse Eterno',
    subtitle: 'End Game',
    description:
      'Uma torre proibida despertada após a queda da Mãe das Trevas. Apenas os maiores calculistas conseguem sobreviver.',
    totalFloors: 20,
    unlocked: false,
  },
]

export function isTowerUnlocked(
  tower: TowerId,
  eclipseUnlocked: boolean,
) {
  if (tower === 'crypt') return true

  return eclipseUnlocked
}
