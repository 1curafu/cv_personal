'use client'

import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'
import WorkRow from './WorkRow'

const PROJECTS = [
  { index: '01', nameKey: 'projectFirstName',  descKey: 'projectFirstDescription',  tags: ['Python', 'Django', 'APIs'],        href: 'https://github.com/1curafu/currency' },
  { index: '02', nameKey: 'projectSecondName', descKey: 'projectSecondDescription', tags: ['HTML', 'CSS', 'JavaScript'],       href: 'https://github.com/1curafu/Musik-Webstore' },
  { index: '03', nameKey: 'projectThirdName',  descKey: 'projectThirdDescription',  tags: ['JavaScript', 'APIs'],              href: 'https://github.com/1curafu/SkyLi-Weathercast' },
  { index: '04', nameKey: 'projectFourthName', descKey: 'projectFourthDescription', tags: ['Fullstack', 'Teamwork'],           href: 'https://github.com/1curafu/Task-Manager' },
] as const

export default function Work() {
  const { t } = useLang()
  const headRef = useReveal()

  return (
    <section id="work" className="py-[clamp(60px,9vw,130px)]">
      <div ref={headRef} className="reveal flex items-baseline gap-[18px] mb-12">
        <span className="font-display font-bold text-[15px] text-accent tracking-[.1em]">02</span>
        <h2 className="font-display font-bold text-[clamp(34px,6vw,64px)] tracking-tight">
          {t('projectsHeading')}
        </h2>
      </div>

      <ul className="border-t border-line">
        {PROJECTS.map(p => (
          <WorkRow
            key={p.index}
            index={p.index}
            name={t(p.nameKey)}
            description={t(p.descKey)}
            tags={[...p.tags]}
            href={p.href}
          />
        ))}
      </ul>
    </section>
  )
}
