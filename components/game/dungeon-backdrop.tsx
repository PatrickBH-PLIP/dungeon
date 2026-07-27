export function DungeonBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        src="/images/dungeon-hall.png"
        alt=""
        className="h-full w-full object-cover opacity-75"
      />
      <div className="absolute inset-0 bg-background/60" />
      <div
        className="absolute inset-0 animate-torch"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 8%, color-mix(in oklab, var(--primary) 26%, transparent), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 95% at 50% 45%, transparent 35%, oklch(0 0 0 / 0.75) 100%)',
        }}
      />
    </div>
  )
}
