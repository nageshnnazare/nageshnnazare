import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import { FileText, ExternalLink } from 'lucide-react'

const publications = [
  {
    title: 'Low-Power 8-Bit Adiabatic Barrel Shifter for DSP Applications',
    venue: 'ACIE 2020, Springer',
    url: 'https://doi.org/10.1007/978-981-15-1483-8_14',
  },
  {
    title: 'Low-Power PFAL Based Speculative Han-Carlson Adder for Signal Processing Applications',
    venue: 'ICICCT 2019, Springer',
    url: 'https://doi.org/10.1007/978-981-13-8461-5_74',
  },
  {
    title: 'Design and Analysis of Adiabatic Vedic Multipliers',
    venue: 'IJPAM 2019',
    url: 'https://acadpubl.eu/hub/2018-119-14/articles/3/75.pdf',
  },
  {
    title: 'Design and Analysis of Low-Power 16-bit Parallel-Prefix Adiabatic Adders',
    venue: 'RCEICT 2018, IEEE',
    url: 'https://doi.org/10.1109/RTEICT42901.2018.9012343',
  },
]

export default function Publications() {
  return (
    <SectionWrapper id="publications" title="Published Work">
      <div className="space-y-4">
        {publications.map((pub, idx) => (
          <motion.a
            key={pub.title}
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ x: 8 }}
            className="group flex items-start gap-4 p-5 rounded-xl glass hover:border-primary/30 transition-all"
          >
            <FileText className="text-primary-light shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={20} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white group-hover:text-primary-light transition-colors leading-snug">
                {pub.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1 font-mono">{pub.venue}</p>
            </div>
            <ExternalLink className="text-gray-600 group-hover:text-primary-light shrink-0 transition-colors mt-0.5" size={16} />
          </motion.a>
        ))}
      </div>
    </SectionWrapper>
  )
}
