import { LEVEL_LABELS, type Skill } from '@/lib/skills'

interface SkillCardProps {
  skill: Skill
  dim: boolean
}

export default function SkillCard({ skill, dim }: SkillCardProps) {
  return (
    <div
      className={`border border-c-line rounded-[13px] p-[15px] bg-white/[.025]
                  transition-all duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)]
                  hover:border-accent hover:accent-glow-lg hover:-translate-y-[3px]
                  ${dim ? 'opacity-[.22] grayscale scale-[.985]' : ''}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-display font-semibold text-[16px] text-c-fg">{skill.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-[.08em] text-c-dim
                         border border-c-line rounded-[5px] px-1.5 py-0.5">
          {skill.category}
        </span>
      </div>

      <div className="flex gap-1 mb-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`flex-1 h-[7px] rounded-[3px] transition-[background] duration-300
                        ${i < skill.level ? 'bg-accent [box-shadow:0_0_9px_-2px_var(--accent)]' : 'bg-white/10'}`}
            style={{ transitionDelay: `${0.05 + i * 0.05}s` }}
          />
        ))}
      </div>

      <div className="font-mono text-[11px] text-c-dim tracking-[.04em]">
        {LEVEL_LABELS[skill.level]} · {skill.level}/5
      </div>
    </div>
  )
}
