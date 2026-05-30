import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import TiltCard from './TiltCard'
import { LinkedinIcon, GithubIcon } from './Icons'
import { GraduationCap, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/mwvzjkkv', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setStatus('sent')
        form.reset()
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <SectionWrapper id="contact" title="Get in Touch">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <p className="text-gray-300 leading-relaxed">
            Have a question, an opportunity, or just want to say hi? Fill out the form and I'll get back to you.
          </p>
          <p className="text-sm text-gray-500">
            Your message will be delivered directly to me. I typically respond within 24 hours.
          </p>

          <div className="flex items-center gap-4">
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
                whileHover={{ scale: 1.1, y: -3 }}
                className="p-3 rounded-full glass text-gray-400 hover:text-white hover:border-primary/50 transition-all"
                aria-label={label}
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TiltCard className="rounded-2xl" tiltIntensity={6} glare>
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-2xl glass-strong space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-xs text-gray-500 uppercase tracking-wider">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs text-gray-500 uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="text-xs text-gray-500 uppercase tracking-wider">Phone (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="mt-1 w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-xs text-gray-500 uppercase tracking-wider">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="mt-1 w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-shadow disabled:opacity-60"
              >
                {status === 'sent' && <><CheckCircle size={16} /> Sent! I'll get back to you.</>}
                {status === 'error' && <><AlertCircle size={16} /> Something went wrong. Try again.</>}
                {status === 'sending' && <>Sending...</>}
                {status === 'idle' && <><Send size={16} /> Send Message</>}
              </motion.button>
            </form>
          </TiltCard>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
