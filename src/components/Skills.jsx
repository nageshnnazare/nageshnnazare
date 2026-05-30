import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import TiltCard from './TiltCard'

const skillCategories = [
  {
    title: 'Languages & Scripting',
    skills: ['C', 'C++11/14/17', 'CUDA', 'x86 Assembly', 'Python', 'Verilog', 'Tcl', 'Bash/Shell', 'Make'],
    color: 'from-indigo-500 to-purple-500',
  },
  {
    title: 'Debugging & Analysis',
    skills: ['gdb/undodb', 'Valgrind', 'AddressSanitizer', 'ThreadSanitizer', 'Coverity'],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Version Control & Tools',
    skills: ['Git', 'Perforce', 'Jira', 'VSCode', 'Cursor'],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Libraries & Frameworks',
    skills: ['STL', 'TBB', 'pthread', 'Raylib', 'ncurses'],
    color: 'from-orange-500 to-rose-500',
  },
]

export default function Skills() {
  return (
    <SectionWrapper id="skills" title="Technical Skills">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category, catIdx) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
          >
            <TiltCard className="h-full rounded-2xl" tiltIntensity={10}>
              <div className="p-6 rounded-2xl glass hover:border-primary/30 transition-colors h-full">
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 bg-gradient-to-r ${category.color} text-transparent bg-clip-text`}>
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-block px-3 py-1.5 text-sm glass-subtle rounded-lg text-gray-300 hover:text-white transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
