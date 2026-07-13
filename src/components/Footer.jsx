export default function Footer() {
  return (
    <footer className="relative border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-mutedlo font-mono">
          Akaash Daniel S · Chennai, India
        </div>
        <div className="flex gap-4">
          <a href="mailto:akaash.daniel.dev@gmail.com" className="text-mutedlo hover:text-ink transition-colors text-sm">
            <i className="fa fa-envelope" />
          </a>
          <a href="https://linkedin.com/in/akaash-daniel" target="_blank" rel="noreferrer" className="text-mutedlo hover:text-ink transition-colors text-sm">
            <i className="fab fa-linkedin-in" />
          </a>
          <a href="https://github.com/akaashdaniel" target="_blank" rel="noreferrer" className="text-mutedlo hover:text-ink transition-colors text-sm">
            <i className="fab fa-github" />
          </a>
        </div>
      </div>
    </footer>
  )
}
