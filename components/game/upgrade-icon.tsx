import {
  Coins,
  Eye,
  Heart,
  Hourglass,
  Shield,
  Snowflake,
  Sparkles,
  Sword,
  type LucideIcon,
} from 'lucide-react'

const MAP: Record<string, LucideIcon> = {
  hourglass: Hourglass,
  heart: Heart,
  shield: Shield,
  sword: Sword,
  coins: Coins,
  snowflake: Snowflake,
  eye: Eye,
  sparkles: Sparkles,
}

export function UpgradeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Sparkles
  return <Icon className={className} aria-hidden="true" />
}
