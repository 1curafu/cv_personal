export default function BgField() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <span
        className="absolute w-[46vmax] h-[46vmax] rounded-full bg-accent
                   opacity-[0.26] blur-[70px] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.22]
                   -top-[12vmax] -left-[8vmax] animate-float-1"
      />
      <span
        className="absolute w-[46vmax] h-[46vmax] rounded-full bg-accent
                   opacity-[0.26] blur-[70px] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.22]
                   -bottom-[16vmax] -right-[8vmax] animate-float-2"
      />
      <span
        className="absolute w-[32vmax] h-[32vmax] rounded-full
                   opacity-[0.26] blur-[70px] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.22]
                   top-[32%] right-[6%] animate-float-3"
        style={{ background: 'color-mix(in srgb, var(--accent) 45%, #8a8a96)' }}
      />
      <span
        className="absolute inset-[-50%] opacity-[0.045] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
