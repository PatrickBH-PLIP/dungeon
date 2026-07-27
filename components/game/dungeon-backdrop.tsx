export function DungeonBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <img
        src="/images/dungeon-hall.png"
        alt=""
        className="h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-background/55" />
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
            'radial-gradient(120% 90% at 50% 50%, transparent 35%, oklch(0 0 0 / 0.75) 100%)',
        }}
      />
    </div>
  )
}
