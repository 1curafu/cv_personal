export type SkillCategory = 'lang' | 'front' | 'back' | 'tools'

export interface Skill {
  name: string
  category: SkillCategory
  level: 1 | 2 | 3 | 4 | 5
}

export const LEVEL_LABELS: Record<number, string> = {
  1: 'basic',
  2: 'working',
  3: 'proficient',
  4: 'advanced',
  5: 'expert',
}

export const SKILLS: Skill[] = [
  { name: 'React',        category: 'front', level: 5 },
  { name: 'TypeScript',   category: 'lang',  level: 5 },
  { name: 'JavaScript',   category: 'lang',  level: 5 },
  { name: 'Tailwind',     category: 'front', level: 4 },
  { name: 'HTML',         category: 'front', level: 5 },
  { name: 'CSS',          category: 'front', level: 5 },
  { name: 'Responsive UI',category: 'front', level: 4 },
  { name: 'Python',       category: 'lang',  level: 3 },
  { name: 'C#',           category: 'lang',  level: 3 },
  { name: 'SQL',          category: 'lang',  level: 3 },
  { name: 'REST APIs',    category: 'back',  level: 4 },
  { name: 'Auth & Data',  category: 'back',  level: 3 },
  { name: 'Git',          category: 'tools', level: 4 },
  { name: 'Bash',         category: 'tools', level: 3 },
]

export const SKILL_TABS = [
  { key: 'all',   label: 'all' },
  { key: 'lang',  label: 'languages' },
  { key: 'front', label: 'frontend' },
  { key: 'back',  label: 'backend' },
  { key: 'tools', label: 'tools' },
] as const
