import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Awards from './components/Awards'
import Certifications from './components/Certifications'
import Projects from './components/Projects'
import Publications from './components/Publications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'
import ScrollRocket from './components/ScrollRobot'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar scrollY={scrollY} />
      <ScrollRocket />
      <main>
        <Hero />
        <About />
        <Awards />
        <Skills />
        <Certifications />
        <Projects />
        <Publications />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
