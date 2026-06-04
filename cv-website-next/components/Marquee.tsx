const ITEMS = ['React', 'TypeScript', 'JavaScript', 'Tailwind', 'Python', 'HTML', 'CSS', 'REST APIs']

export default function Marquee() {
  const all = [...ITEMS, ...ITEMS]

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-line py-[18px]
                 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    >
      <div className="inline-flex items-center gap-[26px] whitespace-nowrap animate-marquee">
        {all.map((item, i) => (
          <span key={i} className="font-display font-bold text-[clamp(22px,3.4vw,38px)]">
            {item}
            {i < all.length - 1 && (
              <i className="not-italic text-accent text-[20px] ml-[26px]">✳</i>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
