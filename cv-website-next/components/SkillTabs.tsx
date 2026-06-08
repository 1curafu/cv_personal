import { SKILL_TABS, SKILLS } from '@/lib/skills'

interface SkillTabsProps {
  active: string
  onSelect: (cat: string) => void
}

export default function SkillTabs({ active, onSelect }: SkillTabsProps) {
  function count(key: string) {
    return key === 'all' ? SKILLS.length : SKILLS.filter(s => s.category === key).length
  }

  return (
    <div role="tablist" aria-label="Filter skills" className="flex flex-wrap gap-2 px-[22px] pb-5">
      {SKILL_TABS.map(tab => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.key)}
            className={`font-mono text-[12.5px] px-[13px] py-2 rounded-[9px] border
                        inline-flex items-center gap-[7px] transition-all duration-[220ms]
                        ${isActive
                          ? 'text-on-accent bg-accent border-accent accent-glow'
                          : 'text-c-dim bg-white/[.04] border-c-line hover:text-c-fg'}`}
          >
            {tab.label}
            <span className={`text-[10px] px-1.5 py-px rounded-full
                              ${isActive ? 'bg-on-accent/25 text-on-accent' : 'bg-white/10 text-c-dim'}`}>
              {count(tab.key)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
