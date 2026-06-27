import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type LucideIcon, ArrowRight, Mail, Code2, Layers, Palette, Camera, Info } from 'lucide-react'

type Lang = 'he' | 'en'

const ROLES: { Icon: LucideIcon; he: string; en: string }[] = [
  { Icon: Code2,    he: 'הנדסאי מחשבים תוכנה', en: 'Software Engineer'   },
  { Icon: Layers,   he: 'פולסטאק',              en: 'Full-Stack Developer' },
  { Icon: Palette,  he: 'מעצב גרפי',            en: 'Graphic Designer'    },
  { Icon: Camera,   he: 'צלם',                  en: 'Photographer'        },
]

const T = {
  he: {
    dir: 'rtl' as const,
    back: 'חזרה',
    rolesTitle: 'תחומי מומחיות',
    email: 'tudioflowh.od@gmail.com',
    appTitle: 'מחשבון נפח מיכל',
    desc: 'מאפשר ניטור וניהול נפח חלב במיכלים 4–14 באמצעות חישוב מדויק לפי גובה המילוי.',
    tanksInfo: '11 מיכלים | 20,000–150,000 ל׳',
    version: 'גרסה 1.0 · 2025',
  },
  en: {
    dir: 'ltr' as const,
    back: 'Back',
    rolesTitle: 'Expertise',
    email: 'tudioflowh.od@gmail.com',
    appTitle: 'Tank Volume Calculator',
    desc: 'Monitor and manage milk volume across tanks 4–14 with precise fill-level calculations.',
    tanksInfo: '11 tanks | 20,000–150,000 L',
    version: 'Version 1.0 · 2025',
  },
}

export function AboutPage() {
  const [lang, setLang] = useState<Lang>('he')
  const navigate = useNavigate()
  const c = T[lang]

  return (
    <main dir={c.dir} className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">

      {/* top bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary transition-colors active:scale-95"
        >
          <ArrowRight size={16} />
          {c.back}
        </button>

        <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1">
          {(['he', 'en'] as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${
                lang === l ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {l === 'he' ? 'עברית' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      {/* profile card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 flex flex-col items-center gap-4">
        <img
          src="/לוגו.png"
          alt="StudioFlow"
          className="h-20 w-auto object-contain rounded-2xl shadow-md"
        />

        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-800">עפר דהן</h1>
          <p className="text-base font-bold text-primary mt-0.5">StudioFlow</p>
          <a
            href={`mailto:${c.email}`}
            className="mt-1 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors"
          >
            <Mail size={12} />
            {c.email}
          </a>
        </div>

        {/* roles */}
        <div className="w-full border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-widest mb-3">
            {c.rolesTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {ROLES.map(({ Icon, he, en }) => (
              <span
                key={he}
                className="flex items-center gap-1.5 bg-blue-50 text-primary rounded-full px-3 py-1.5 text-sm font-semibold"
              >
                <Icon size={14} />
                {lang === 'he' ? he : en}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* app info */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <Info size={15} className="text-primary" />
          {c.appTitle}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">{c.desc}</p>
        <div className="flex justify-between items-center text-xs text-gray-400 font-semibold border-t border-gray-100 pt-3">
          <span>{c.tanksInfo}</span>
          <span>{c.version}</span>
        </div>
      </div>

    </main>
  )
}
