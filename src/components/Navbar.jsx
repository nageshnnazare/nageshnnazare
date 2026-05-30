import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Awards', href: '#awards' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Publications', href: '#publications' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar({ scrollY }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isScrolled = scrollY > 50

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50"
    >
      <div
        className={`max-w-5xl mx-auto rounded-2xl transition-all duration-500 ${
          isScrolled
            ? 'bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-white/[0.02]'
        }`}
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isScrolled
            ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
            : 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="px-6 sm:px-8">
          <div className="flex items-center justify-between h-14">
            <motion.a
              href="#"
              className="text-lg font-bold bg-gradient-to-r from-primary-light to-accent text-transparent bg-clip-text"
              whileHover={{ scale: 1.05 }}
            >
              NN
            </motion.a>

            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-1.5 text-sm text-gray-400 hover:text-white rounded-full hover:bg-white/[0.08] transition-all duration-200"
                  whileHover={{ y: -1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 max-w-5xl mx-auto rounded-2xl overflow-hidden"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
