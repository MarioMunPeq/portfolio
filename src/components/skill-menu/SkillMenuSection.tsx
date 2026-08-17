import { DiamondMarker } from '../shared/DiamondMarker'
import { Reveal } from '../primitives/Reveal'
import type { ProfileSkills, SpokenLanguage } from '../../data/profile'

interface Props {
  skills: ProfileSkills
  languages: SpokenLanguage[]
  interests: string[]
}

interface Category {
  title: string
  sys: string
  items?: string[]
  languages?: SpokenLanguage[]
  span: string
  rotate: string
  clip: string
}

export function SkillMenuSection({ skills, languages, interests }: Props) {
  const CATEGORIES: Category[] = [
    {
      title: 'ARSENAL',
      sys: 'SYS.01',
      items: skills.programming,
      span: 'lg:col-span-7',
      rotate: '-0.5',
      clip: 'clip-cut-br',
    },
    {
      title: 'SISTEMAS',
      sys: 'SYS.02',
      items: skills.technologies,
      span: 'lg:col-span-5',
      rotate: '0.3',
      clip: 'clip-cut-bl',
    },
    {
      title: 'COGNICIÓN',
      sys: 'SYS.03',
      items: skills.aiData,
      span: 'lg:col-span-5',
      rotate: '-0.8',
      clip: 'clip-notch',
    },
    {
      title: 'HERRAMIENTAS',
      sys: 'SYS.04',
      items: skills.other,
      span: 'lg:col-span-3',
      rotate: '0.2',
      clip: '',
    },
    {
      title: 'COMUNICACIÓN',
      sys: 'SYS.05',
      languages,
      span: 'lg:col-span-4',
      rotate: '0',
      clip: 'clip-cut-br',
    },
    {
      title: 'MUNDO EXTERIOR',
      sys: 'SYS.06',
      items: interests,
      span: 'lg:col-span-8',
      rotate: '-0.3',
      clip: 'clip-notch',
    },
  ]

  return (
    <Reveal delay={0.16}>
      <div className="mt-14 lg:mt-16">
        <div className="mb-8 flex items-center gap-3">
          <DiamondMarker size={7} />
          <h2
            className="font-p5-menu uppercase tracking-[0.15em] text-paper"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            HABILIDADES
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {CATEGORIES.map((cat) => {
            const count = cat.items?.length ?? cat.languages?.length ?? 0
            return (
              <div
                key={cat.title}
                className={`${cat.span} ${cat.clip}`}
                style={{ transform: `rotate(${cat.rotate}deg)` }}
              >
                <div className="skill-entry group">
                  <div className="skill-entry__bar" />

                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="skill-entry__diamond" />
                      <h3 className="skill-entry__title">{cat.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="skill-entry__count">{count} ITEMS</span>
                      <span className="skill-entry__sys">{cat.sys}</span>
                    </div>
                  </div>

                  {cat.items && (
                    <div className="skill-entry__items">
                      {cat.items.map((item) => (
                        <span key={item} className="skill-entry__item">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {cat.languages && (
                    <div className="mt-3 space-y-2">
                      {cat.languages.map((lang) => (
                        <div
                          key={lang.name}
                          className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5"
                        >
                          <span className="font-sans text-sm text-paper/80 transition-colors group-hover:text-paper">
                            {lang.name}
                          </span>
                          <span className="text-xs uppercase tracking-[0.12em] text-paper/40">
                            — {lang.level}
                          </span>
                          {lang.note ? (
                            <span className="w-full pl-4 text-xs text-paper/30 md:w-auto md:pl-0">
                              {lang.note}
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Reveal>
  )
}
