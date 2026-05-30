import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import TiltCard from './TiltCard'
import Terminal3D from './Terminal3D'

const timeline = [
  {
    company: 'Synopsys Inc.',
    role: 'Staff Engineer, R&D',
    tech: 'C/C++ • Tcl • Python',
    period: 'Sep 2022 — Present',
    highlights: [
      '7%+ runtime improvement on Attribute System across 21 production designs',
      '6.5%+ perf gain on Timer Update via multi-threading (25-30% on key designs)',
      '80+ customer issues, 500+ defects — memory leaks, data races, non-determinism',
    ],
  },
  {
    company: 'Bharat Electronics Ltd.',
    role: 'Deputy Engineer, R&D',
    tech: 'Embedded C/C++ • Verilog',
    period: 'Oct 2018 — Aug 2022',
    highlights: [
      'End-to-end marine Satcom-on-the-Move system on Xilinx Zynq SoC',
      'Real-time satellite tracking algorithm — 0.2% pointing accuracy',
      'EtherCAT Master stack for closed-loop motor control',
    ],
  },
  {
    company: 'R.V. College of Engineering',
    role: 'B.E. Electronics & Telecommunication',
    tech: 'CGPA 9.07/10 • Gold Medal',
    period: 'Sep 2014 — May 2018',
    highlights: [
      'First Rank — awarded Gold Medal',
      '5 published papers (IEEE, Springer)',
    ],
  },
  {
    company: 'Nokia',
    role: 'R&D Intern',
    tech: 'C/C++ • Arduino',
    period: 'Aug — Dec 2017',
    highlights: [
      'Cellular-based gate control prototype replacing RFID infrastructure',
    ],
  },
]

export default function About() {
  return (
    <SectionWrapper id="about" title="About">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Terminal3D />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-5"
        >
          <p className="text-lg text-gray-200 leading-relaxed">
            I build and optimize <span className="text-primary-light font-semibold">high-performance systems software</span> at
            scale — from compiler internals to real-time embedded control.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Currently at Synopsys, working on Design Compiler & Fusion Compiler.
            Previously shipped one-of-its-kind marine satcom-on-the-move system at Bharat Electronics.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { value: '7+', label: 'Years Experience', color: 'from-indigo-400 to-purple-400' },
              { value: '500+', label: 'Bugs Squashed', color: 'from-cyan-400 to-blue-400' },
              { value: '5', label: 'Papers Published', color: 'from-emerald-400 to-teal-400' },
              { value: '80+', label: 'Customer Issues', color: 'from-orange-400 to-rose-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                className="text-center p-3 rounded-xl glass"
              >
                <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="relative mt-16">
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent rounded-full" />

        <div className="space-y-8">
          {timeline.map((exp, idx) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12, type: 'spring' }}
              className="relative pl-12 md:pl-20"
            >
              <div className="absolute left-2 md:left-6 top-4 w-5 h-5 rounded-full bg-dark border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>

              <TiltCard className="rounded-2xl" tiltIntensity={5} glare>
                <div className="p-5 sm:p-6 rounded-2xl glass-strong group">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                      <p className="text-sm text-primary-light">{exp.role} <span className="text-gray-600">•</span> <span className="text-gray-500">{exp.tech}</span></p>
                    </div>
                    <span className="text-xs text-accent font-mono glass-subtle px-2.5 py-1 rounded-full w-fit">{exp.period}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {exp.highlights.map((item, i) => (
                      <li key={i} className="text-sm text-gray-400 flex gap-2">
                        <span className="text-primary shrink-0">▹</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
