import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import TiltCard from './TiltCard'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from './Icons'

const projects = [
  {
    title: 'LLVM Debugger (lldb)',
    tech: 'C++',
    description:
      'Designed and integrated a dedicated console pane in the LLDB (LLVM) debugger, enabling real-time capture and logging of stdout/stderr streams for improved visibility.',
    github: 'https://github.com/llvm/llvm-project/pull/177160',
    isContribution: true,
  },
  {
    title: 'cynide',
    tech: 'C++',
    description:
      'Designed and developed cylang, an ahead-of-time (AoT) compiler for cynide, a programming language featuring Python-like syntax. Implemented the complete compilation pipeline including a custom lexer, parser, semantic analyzer, and LLVM-based code generation backend.',
    github: 'https://github.com/nageshnnazare/cynide',
    isContribution: false,
  },
]

export default function Projects() {
  return (
    <SectionWrapper id="projects" title="Projects & Open Source">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
          >
            <TiltCard className="h-full rounded-2xl" tiltIntensity={15} glare>
              <div className="group relative p-6 rounded-2xl glass hover:border-primary/30 transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full glass-subtle text-primary-light">
                        {project.tech}
                      </span>
                      {project.isContribution && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full glass-subtle text-emerald-400">
                          Open Source
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <GithubIcon size={18} />
                  </a>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{project.description}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
