'use client'

import { useReveal } from '@/hooks/useReveal'

interface WorkRowProps {
  index: string
  name: string
  description: string
  tags: string[]
  repoHref: string
  liveHref?: string
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  )
}

const linkClass =
  'inline-flex items-center gap-1.5 font-display font-semibold text-[13px] text-ink-2 ' +
  'group-hover:text-on-accent hover:underline underline-offset-4 transition-colors duration-300'

export default function WorkRow({ index, name, description, tags, repoHref, liveHref }: WorkRowProps) {
  const ref = useReveal<HTMLLIElement>()

  return (
    <li ref={ref} className="reveal border-b border-line group relative">
      <span
        className="absolute left-0 top-0 bottom-0 w-0 bg-accent -z-10
                   rounded-r-[18px] group-hover:w-full
                   transition-[width] duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)]"
      />

      <div
        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto]
                   items-center gap-[clamp(16px,3vw,40px)] px-2
                   py-[clamp(20px,3vw,34px)]
                   group-hover:pl-7 group-hover:pr-5 transition-[padding] duration-300"
      >
        <span className="font-display font-semibold text-[14px] text-ink-2
                         group-hover:text-on-accent/75 transition-colors duration-300">
          {index}
        </span>

        <span>
          <span className="block font-display font-bold tracking-tight
                           text-[clamp(24px,3.6vw,40px)]
                           group-hover:text-on-accent transition-colors duration-300">
            {name}
          </span>
          <span className="block text-ink-2 text-[15px] max-w-[52ch] mt-1.5
                           group-hover:text-on-accent/90 transition-colors duration-300">
            {description}
          </span>
        </span>

        <span className="hidden md:flex gap-1.5 flex-wrap justify-end max-w-[220px]">
          {tags.map(tag => (
            <b key={tag}
               className="font-display font-semibold text-[12px] px-[11px] py-[5px]
                          rounded-full border border-line text-ink-2 whitespace-nowrap
                          group-hover:border-on-accent/50 group-hover:text-on-accent
                          transition-colors duration-300">
              {tag}
            </b>
          ))}
        </span>

        <span className="flex items-center gap-3.5 md:gap-5 justify-self-end">
          <a
            href={repoHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} — source code on GitHub`}
            className={linkClass}
          >
            Code <Arrow />
          </a>
          {liveHref && (
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} — live site`}
              className={linkClass}
            >
              Live <Arrow />
            </a>
          )}
        </span>
      </div>
    </li>
  )
}
