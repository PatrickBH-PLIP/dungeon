'use client'

import { CornerDownLeft, Delete, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  onDigit: (d: string) => void
  onBackspace: () => void
  onClear: () => void
  onToggleNegative: () => void
  onSubmit: () => void
  allowNegative: boolean
  negative: boolean
  disabled: boolean
}

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3']

export function Numpad({
  onDigit,
  onBackspace,
  onClear,
  onToggleNegative,
  onSubmit,
  allowNegative,
  negative,
  disabled,
}: Props) {
  return (
    <div className="flex gap-2">
      <div className="grid flex-1 grid-cols-3 gap-2">
        {KEYS.map((k) => (
          <Button
            key={k}
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={() => onDigit(k)}
            className="h-14 border border-border/70 font-serif text-2xl font-semibold tabular-nums hover:border-primary/60 hover:text-primary"
          >
            {k}
          </Button>
        ))}

        <Button
          type="button"
          variant="secondary"
          disabled={disabled || !allowNegative}
          onClick={onToggleNegative}
          aria-pressed={negative}
          aria-label="Alternar sinal negativo"
          className={`h-14 border border-border/70 ${
            negative ? 'border-primary bg-primary/20 text-primary' : ''
          }`}
        >
          <Minus className="size-5" />
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={() => onDigit('0')}
          className="h-14 border border-border/70 font-serif text-2xl font-semibold tabular-nums hover:border-primary/60 hover:text-primary"
        >
          0
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={onBackspace}
          onDoubleClick={onClear}
          aria-label="Apagar último dígito"
          className="h-14 border border-border/70"
        >
          <Delete className="size-5" />
        </Button>
      </div>

      <Button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className="h-full w-28 flex-col gap-1 font-serif text-base font-bold tracking-wide"
      >
        <CornerDownLeft className="size-5" />
        ATACAR
      </Button>
    </div>
  )
}
