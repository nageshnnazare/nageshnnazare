import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import { Award, ExternalLink } from 'lucide-react'

const certifications = [
  { name: 'Modern C++11/14/17', issuer: 'Packt', url: 'https://www.coursera.org/account/accomplishments/specialization/0WUOG9B1QK7F' },
  { name: 'Accelerated Computing in CUDA C/C++', issuer: 'Nvidia', url: 'https://learn.nvidia.com/certificates?id=PuisTXevQTSlMtpaG9bhpA#' },
  { name: 'Claude Code', issuer: 'Anthropic', url: 'https://verify.skilljar.com/c/hnxf4b7eucfi' },
  { name: 'Accelerated Computer Science Fundamentals', issuer: 'UIUC', url: 'https://www.coursera.org/account/accomplishments/specialization/RTREEARS54NZ' },
  { name: 'Supervised Machine Learning', issuer: 'Stanford Online', url: 'https://www.coursera.org/account/accomplishments/verify/6SMC64US4VSV' },
  { name: 'Algorithmic Toolbox', issuer: 'UCSA', url: 'https://www.coursera.org/account/accomplishments/verify/XGH94G5FM357' },
]

export default function Certifications() {
  return (
    <SectionWrapper id="certifications" title="Certifications">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((cert, idx) => (
          <motion.a
            key={cert.name}
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="group p-4 rounded-xl glass hover:border-accent/30 transition-all flex items-start gap-3"
          >
            <Award className="text-accent shrink-0 mt-0.5" size={18} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white group-hover:text-accent transition-colors truncate">
                {cert.name}
              </h4>
              <p className="text-xs text-gray-500">{cert.issuer}</p>
            </div>
            <ExternalLink className="text-gray-600 group-hover:text-accent shrink-0 transition-colors" size={14} />
          </motion.a>
        ))}
      </div>
    </SectionWrapper>
  )
}
