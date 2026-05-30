import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import TiltCard from './TiltCard'

const commands = [
  { cmd: 'whoami', output: 'Nagesh N Nazare' },
  { cmd: 'role', output: 'Staff Engineer, R&D @ Synopsys' },
  { cmd: 'experience', output: '7+ years | Systems & Performance Engineering' },
  { cmd: 'skills', output: 'C/C++17 • CUDA • x86 ASM • Python • Verilog' },
  { cmd: 'focus', output: 'Runtime optimization • Multi-threading • EDA' },
  { cmd: 'impact', output: '80+ customer issues • 500+ defects resolved' },
]

export default function Terminal3D() {
  const [lines, setLines] = useState([])
  const [currentCmd, setCurrentCmd] = useState(0)
  const [typingCmd, setTypingCmd] = useState('')
  const [showOutput, setShowOutput] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const termRef = useRef(null)

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(blink)
  }, [])

  useEffect(() => {
    if (currentCmd >= commands.length) {
      const timeout = setTimeout(() => {
        setLines([])
        setCurrentCmd(0)
        setTypingCmd('')
        setShowOutput(false)
      }, 4000)
      return () => clearTimeout(timeout)
    }

    const cmd = commands[currentCmd].cmd
    let charIdx = 0
    setTypingCmd('')
    setShowOutput(false)

    const typeInterval = setInterval(() => {
      charIdx++
      setTypingCmd(cmd.slice(0, charIdx))
      if (charIdx >= cmd.length) {
        clearInterval(typeInterval)
        setTimeout(() => {
          setShowOutput(true)
          setLines(prev => [
            ...prev,
            { cmd: cmd, output: commands[currentCmd].output }
          ])
          setTypingCmd('')
          setTimeout(() => setCurrentCmd(c => c + 1), 800)
        }, 300)
      }
    }, 60)

    return () => clearInterval(typeInterval)
  }, [currentCmd])

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight
    }
  }, [lines, typingCmd])

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -10 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full"
      style={{ perspective: 1200 }}
    >
      <TiltCard className="rounded-xl" tiltIntensity={12} glare>
        <div
          className="rounded-xl overflow-hidden shadow-2xl shadow-primary/20"
          style={{
            background: 'rgba(10, 10, 30, 0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-gray-500 font-mono">nagesh@dev ~ </span>
          </div>

          {/* Terminal body */}
          <div ref={termRef} className="p-4 font-mono text-sm h-[260px] overflow-hidden">
            {lines.map((line, i) => (
              <div key={i} className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-accent">❯</span>
                  <span className="text-gray-300">{line.cmd}</span>
                </div>
                <div className="ml-5 text-primary-light">{line.output}</div>
              </div>
            ))}

            {currentCmd < commands.length && (
              <div className="flex items-center gap-2">
                <span className="text-accent">❯</span>
                <span className="text-gray-300">
                  {typingCmd}
                  <span className={`inline-block w-2 h-4 ml-0.5 -mb-0.5 ${cursorVisible ? 'bg-primary-light' : 'bg-transparent'}`} />
                </span>
              </div>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}
