import { motion } from 'framer-motion'

export default function SectionWrapper({ id, title, children, className = '' }) {
  return (
    <section id={id} className={`relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-light to-accent text-transparent bg-clip-text">
                {title}
              </span>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-0.5 w-24 mt-2 bg-gradient-to-r from-primary via-accent to-transparent rounded-full origin-left"
          />
        </motion.div>
        {children}
      </div>
    </section>
  )
}
