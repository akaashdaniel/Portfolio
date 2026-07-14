import SignalBackground from './components/SignalBackground'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import useLenis from './hooks/useLenis'

export default function App() {
  useLenis()

  return (
    <div className="relative min-h-screen bg-bg font-body">
      <SignalBackground />
      <Cursor />
      <div className="relative z-10">
        <Nav />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}