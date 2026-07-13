import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
})

const projects = [
  {
    badge: 'TNSCST Funded · ₹60,000',
    name: 'DiseaseGPT',
    tagline: 'RAG-based medical AI, funded by the Tamil Nadu government and deployed live for public testing.',
    problem:
      'Symptom-based self-assessment tools are usually keyword matchers — they miss context and give patients false confidence or unnecessary alarm.',
    approach:
      'Built a RAG-based medical QA system using LangChain and the OpenAI API, mapping 80+ symptoms to potential diagnoses with a Flask REST backend designed for concurrent users.',
    outcome:
      'Selected and funded by the Tamil Nadu State Council for Science & Technology (IPD-128). Deployed live for public testing with sub-2-second response latency.',
    tags: ['Python', 'Flask', 'React', 'LangChain', 'OpenAI API'],
    link: 'https://github.com/akaashdaniel',
  },
  {
    badge: null,
    name: 'Tamil Nadu Health Insight Dashboard',
    tagline: 'District-level health analytics dashboard identifying regional risk patterns across Tamil Nadu.',
    problem:
      'District-level public health data across Tamil Nadu exists but is scattered — hard for policy teams to act on without manual analysis.',
    approach:
      'Built an interactive Streamlit dashboard applying K-Means clustering across district-level health indicators to surface regional patterns.',
    outcome:
      'Identified 4 distinct health-risk clusters across 38 districts, giving a data-driven starting point for resource allocation.',
    tags: ['Python', 'Pandas', 'Plotly', 'Scikit-learn', 'Streamlit'],
    link: 'https://github.com/akaashdaniel',
  },
  {
    badge: null,
    name: 'Bias Audit Tool for Medical AI',
    tagline: 'Fairness auditing for healthcare ML models across age and gender demographics.',
    problem:
      'Healthcare ML models can silently underperform for specific age or gender groups — a risk that goes unnoticed without explicit auditing.',
    approach:
      'Used the Fairlearn library to evaluate Scikit-learn models across demographic groups, quantifying disparate-impact metrics.',
    outcome:
      'Visualised bias patterns and proposed concrete mitigation strategies grounded in Responsible AI methodology.',
    tags: ['Python', 'Scikit-learn', 'Fairlearn', 'Matplotlib'],
    link: 'https://github.com/akaashdaniel',
  },
]

const sideProject = {
  name: 'Nova Rift',
  desc: 'A browser-based space shooter built from scratch — zero libraries, pure vanilla JavaScript and the Canvas API. A personal exercise in game engineering.',
  tags: ['JavaScript', 'Canvas API'],
  github: 'https://github.com/akaashdaniel/Nove-Rift',
  demo: 'https://akaashdaniel.github.io/Nove-Rift/',
}

function ProjectCard({ p, i, isOpen, onToggle }) {
  return (
    <motion.div
      {...reveal(i * 0.1)}
      className={`bg-card border rounded-2xl overflow-hidden transition-colors ${
        isOpen ? 'border-signal/40' : 'border-border hover:border-borderhi'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-7 md:p-8 flex items-start justify-between gap-5"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2.5">
            <h3 className="font-display font-semibold text-xl md:text-2xl text-ink tracking-tight">
              {p.name}
            </h3>
            {p.badge && (
              <span className="font-mono text-[10px] tracking-wide text-verified bg-verified/10 border border-verified/25 rounded-full px-2.5 py-1 whitespace-nowrap">
                {p.badge}
              </span>
            )}
          </div>
          <p className="text-[13.5px] text-muted leading-relaxed max-w-xl">
            {p.tagline}
          </p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center mt-1 ${
            isOpen ? 'border-signal text-signal bg-signal/10' : 'border-border text-muted'
          }`}
        >
          <i className="fa fa-plus text-xs" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-7 md:px-8 pb-8">
              <div className="h-px bg-border mb-6" />
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="font-mono text-[10px] text-mutedlo tracking-wider mb-2">PROBLEM</div>
                  <p className="text-[13.5px] text-muted leading-relaxed">{p.problem}</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-mutedlo tracking-wider mb-2">APPROACH</div>
                  <p className="text-[13.5px] text-muted leading-relaxed">{p.approach}</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-mutedlo tracking-wider mb-2">OUTCOME</div>
                  <p className="text-[13.5px] text-ink leading-relaxed">{p.outcome}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10.5px] text-mutedlo bg-white/[0.03] border border-border rounded-full px-2.5 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-signal2 hover:text-ink transition-colors shrink-0"
                >
                  <i className="fab fa-github" /> View code
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Projects() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="work" className="relative py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...reveal()} className="mb-14">
          <span className="eyebrow">// projects </span>
          <h2 className="font-display font-black text-4xl md:text-6xl tracking-tightest text-ink mt-4 max-w-2xl">
            PROJECTS
          </h2>
          <p className="text-muted mt-4 max-w-lg text-[15px]">
            Every project here shipped, was funded, or solved a real problem end to end.
            Tap any card to see how it was built.
          </p>
        </motion.div>

        <div className="space-y-4">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.name}
              p={p}
              i={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>

        <motion.div
          {...reveal(0.3)}
          className="mt-4 bg-card/50 border border-border border-dashed rounded-2xl p-7 md:p-9 flex flex-wrap items-center justify-between gap-6"
        >
          <div>
            <div className="font-mono text-[10px] text-mutedlo tracking-wider mb-2">SIDE PROJECT</div>
            <h3 className="font-display font-medium text-lg text-ink mb-1.5">{sideProject.name}</h3>
            <p className="text-[13px] text-muted max-w-md leading-relaxed">{sideProject.desc}</p>
          </div>
          <div className="flex gap-3">
            <a
              href={sideProject.github}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted hover:text-ink transition-colors inline-flex items-center gap-2"
            >
              <i className="fab fa-github" /> Code
            </a>
            <a
              href={sideProject.demo}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted hover:text-ink transition-colors inline-flex items-center gap-2"
            >
              <i className="fa fa-arrow-up-right-from-square" /> Play
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
