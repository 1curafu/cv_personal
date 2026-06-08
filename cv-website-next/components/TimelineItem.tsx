'use client'

import { useReveal } from '@/hooks/useReveal'

interface TimelineItemProps {
  date: string
  title: string
  description: string
  isOpen?: boolean
}

export default function TimelineItem({ date, title, description, isOpen }: TimelineItemProps) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className="reveal relative grid grid-cols-[150px_1fr] max-sm:grid-cols-1
                 items-start gap-[22px] py-[18px] max-sm:pl-[34px]"
    >
      <span className="font-display font-semibold text-[14px] text-accent text-right
                       pr-[26px] pt-1 max-sm:text-left max-sm:pr-0">
        {date}
      </span>

      <div
        className={`absolute left-[11px] top-2 w-4 h-4 rounded-full border-[3px] border-bg
                    shadow-[0_0_0_3px_var(--accent)] max-sm:left-0
                    ${isOpen ? 'bg-bg' : 'bg-accent'}`}
      />

      <div className="pl-3.5 max-sm:pl-0">
        <h3 className="font-display font-bold text-[clamp(19px,2.4vw,26px)] mb-1.5">{title}</h3>
        <p className="text-ink-2 text-[15px] max-w-[56ch]">{description}</p>
      </div>
    </div>
  )
}
