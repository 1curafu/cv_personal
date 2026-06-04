'use client'

import { useLang } from '@/hooks/useLang'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="w-[min(1180px,calc(100%-32px))] mx-auto pt-[50px] pb-10 border-t border-line">
      <div className="flex items-center gap-5 flex-wrap">
        <span className="grid place-items-center w-[34px] h-[34px] rounded-[11px]
                         bg-accent text-on-accent text-[14px] font-display font-bold
                         tracking-wide accent-shadow">
          MK
        </span>
        <p className="font-display font-semibold text-[clamp(18px,2.4vw,26px)]">
          {t('footerCta')}
        </p>
        <a href="#top" className="ml-auto font-bold text-ink-2 hover:text-accent transition-colors">
          ↑ {t('footerTop')}
        </a>
      </div>

      <div className="flex justify-between flex-wrap gap-2 mt-7 text-ink-2 text-[13px]">
        <p>© 2026 Mykhailo Khimich</p>
        <p>Rapperswil-Jona, Switzerland · mykhailo.khimich@icloud.com</p>
      </div>
    </footer>
  )
}
