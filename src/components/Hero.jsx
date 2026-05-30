import { motion } from 'framer-motion'
import { GraduationCap, ChevronDown } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">

      <div className="text-center z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white via-primary-light to-accent text-transparent bg-clip-text">
              Nagesh N Nazare
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light drop-shadow-lg px-4"
        >
          I make software run <span className="text-primary-light font-medium">faster</span>, scale <span className="text-accent font-medium">harder</span>, and crash <span className="text-emerald-400 font-medium">never</span>.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-3 text-xs sm:text-sm md:text-base text-gray-500 font-mono"
        >
          7+ yrs deep in C/C++ &middot; performance &middot; compilers &middot; embedded systems
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-10 flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
        >
          {[
            { icon: LinkedinIcon, href: 'https://linkedin.com/in/nagesh-n-nazare/', label: 'LinkedIn' },
            { icon: GithubIcon, href: 'https://github.com/nageshnnazare', label: 'GitHub' },
            { icon: GraduationCap, href: 'https://scholar.google.com/citations?user=KDOJ2IAAAAAJ&hl=en', label: 'Scholar' },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass text-gray-300 hover:text-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.95 }}
              aria-label={label}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 hover:text-primary transition-colors z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.a>
    </section>
  )
}
