import { motion } from 'framer-motion'

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

const jobs = [
  {
    co: 'Electronics Test & Development Centre (ETDC)',
    sub: 'Govt. of India — STQC Division',
    role: 'QA Engineer, Apprenticeship',
    date: 'Mar 2026 — Present',
    points: [
      'Validated data integrity and functional compliance for 3 government web portals (Jal Shakti, CRPF, NaRMIS) and 2 mobile apps.',
      'Executed regression and UAT test cycles for Android & iOS apps to STQC certification standards.',
      'Produced structured bug reports, test summaries, and compliance documentation for Govt. of India QA protocols.',
    ],
  },
  {
    co: 'Grace Food Courts Pvt. Ltd.',
    sub: 'Chicking India',
    role: 'Web Developer, Management Trainee',
    date: 'Jan — Feb 2026',
    points: [
      'Designed and shipped a responsive e-commerce platform with product listings, cart, and clean UI using HTML, CSS, and JavaScript.',
    ],
  },
  {
    co: 'Apdeops Technologies Pvt. Ltd.',
    sub: 'Chennai — On-site',
    role: 'Cloud Developer, Trainee',
    date: 'Aug — Nov 2025',
    points: [
      'Deployed and maintained AWS cloud solutions with infrastructure monitoring and cost control.',
      'Configured CI/CD pipelines that reduced deployment time and release-related downtime.',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...reveal()} className="mb-14">
          <span className="eyebrow">// experience</span>
          <h2 className="font-display font-semibold text-4xl md:text-5xl tracking-tightest text-ink mt-4 max-w-2xl">
            WORK EXPERIENCE
          </h2>
        </motion.div>

        <div className="relative pl-8 md:pl-10">
          <div className="absolute left-[5px] md:left-[7px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-8">
            {jobs.map((j, i) => (
              <motion.div key={j.co} {...reveal(i * 0.1)} className="relative">
                <div className="absolute -left-8 md:-left-10 top-2 w-2.5 h-2.5 rounded-full bg-signal ring-4 ring-bg" />
                <div className="bg-card border border-border rounded-2xl p-6 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                    <h3 className="font-display font-medium text-lg text-ink">{j.co}</h3>
                    <span className="font-mono text-[11px] text-signal bg-signal/10 border border-signal/20 rounded-full px-3 py-1 whitespace-nowrap">
                      {j.date}
                    </span>
                  </div>
                  <div className="text-[12.5px] text-mutedlo mb-3">{j.sub}</div>
                  <div className="text-[13px] text-verified font-medium mb-4">{j.role}</div>
                  <ul className="space-y-2">
                    {j.points.map((p) => (
                      <li key={p} className="text-[13.5px] text-muted leading-relaxed pl-4 relative">
                        <span className="absolute left-0 text-signal">—</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
