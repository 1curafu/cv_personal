'use client'

import { useReveal } from '@/hooks/useReveal'

interface WorkRowProps {
  index: string
  name: string
  description: string
  tags: string[]
  href: string
}

export default function WorkRow({ index, name, description, tags, href }: WorkRowProps) {
  const ref = useReveal<HTMLLIElement>()

  return (
    <li ref={ref} className="reveal border-b border-line group">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto]
                   items-center gap-[clamp(16px,3vw,40px)] px-2
                   py-[clamp(20px,3vw,34px)] relative
                   hover:pl-7 hover:pr-5 transition-[padding,color] duration-300"
      >
        <span
          className="absolute left-0 top-0 bottom-0 w-0 bg-accent -z-10
                     rounded-r-[18px] group-hover:w-full
                     transition-[width] duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)]"
        />

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

        <span className="text-ink-2 group-hover:text-on-accent
                         group-hover:translate-x-1 group-hover:-translate-y-1
                         transition-all duration-300">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M7 7h10v10"/>
          </svg>
        </span>
      </a>
    </li>
  )
}
