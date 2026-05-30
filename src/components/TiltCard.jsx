import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function TiltCard({ children, className = '', glare = true, tiltIntensity = 15 }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const centerX = x - 0.5
    const centerY = y - 0.5

    setTilt({
      rotateX: -centerY * tiltIntensity,
      rotateY: centerX * tiltIntensity,
    })
    setGlarePos({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {glare && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-30 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(99,102,241,0.4) 0%, rgba(6,182,212,0.1) 40%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  )
}
