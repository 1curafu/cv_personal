'use client'

import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'
import type { TranslationKey } from '@/lib/translations'
import WorkRow from './WorkRow'

type Project = {
  index: string
  nameKey: TranslationKey
  descKey: TranslationKey
  tags: string[]
  repoHref: string
  liveHref?: string
}

const PROJECTS: Project[] = [
  { index: '01', nameKey: 'projectFirstName',  descKey: 'projectFirstDescription',  tags: ['React', 'TypeScript', 'Supabase'],   repoHref: 'https://github.com/bwz-imst24a-projects/trails-management-app-mykhailo', liveHref: 'https://trails-management-app.vercel.app' },
  { index: '02', nameKey: 'projectSecondName', descKey: 'projectSecondDescription', tags: ['JavaScript', 'Node', 'APIs'],         repoHref: 'https://github.com/1curafu/SkyLi-Weathercast', liveHref: 'https://skyli-weathercast.onrender.com/' },
  { index: '03', nameKey: 'projectThirdName',  descKey: 'projectThirdDescription',  tags: ['Next.js', 'TypeScript', 'Supabase'],  repoHref: 'https://github.com/1curafu/Task-Manager',      liveHref: 'https://www.vela.works/' },
]

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
            tags={p.tags}
            repoHref={p.repoHref}
            liveHref={p.liveHref}
          />
        ))}
      </ul>
    </section>
  )
}
