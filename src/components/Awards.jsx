import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import TiltCard from './TiltCard'
import { Trophy } from 'lucide-react'

const awards = [
  {
    title: 'Synopsys Quarterly Recognition Awards',
    detail: 'Q4 2025 & Q2 2023 — Outstanding contributions in resolving critical, high business impact issues.',
  },
  {
    title: 'SILC Finalist (2025, 2023)',
    detail: 'Synopsys Innovation & Leadership Conference — Technical posters on novel runtime & scalability improvement strategies.',
  },
  {
    title: 'BEL R&D Excellence Award 2022',
    detail: 'Innovation and execution of first-of-its-kind, indigenous Satcom-on-the-Move system.',
  },
  {
    title: 'First Rank Award 2018',
    detail: 'Highest marks in E&T Engineering, R.V. College of Engineering.',
  },
  {
    title: 'Cisco Ideathon Winner 2018',
    detail: 'Winner of Cisco Ideathon Event at RVCE.',
  },
  {
    title: "Nokia Innovation Day Runner's Up 2017",
    detail: 'Small cell based gate control system exhibition.',
  },
]

export default function Awards() {
  return (
    <SectionWrapper id="awards" title="Awards & Achievements">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {awards.map((award, idx) => (
          <motion.div
            key={award.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
          >
            <TiltCard className="h-full rounded-2xl" tiltIntensity={18} glare>
              <div className="p-5 rounded-2xl glass hover:border-yellow-500/20 transition-all group h-full">
                <Trophy className="text-yellow-400 mb-3 group-hover:scale-110 transition-transform" size={20} />
                <h4 className="font-semibold text-white text-sm mb-1">{award.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{award.detail}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
