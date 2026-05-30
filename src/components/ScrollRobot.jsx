import { useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Rocket({ isScrolling, scrollDirection }) {
  const group = useRef()
  const rocketBody = useRef()
  const flameOuter = useRef()
  const flameInner = useRef()
  const flameCore = useRef()
  const currentRotation = useRef(0)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (group.current) {
      group.current.rotation.z = Math.sin(t * 2) * (isScrolling.current ? 0.06 : 0.02)
    }

    // Rotate rocket to face scroll direction (0 = nose up, PI = nose down)
    const targetRot = scrollDirection.current > 0 ? Math.PI : 0
    currentRotation.current += (targetRot - currentRotation.current) * 0.05
    if (rocketBody.current) {
      rocketBody.current.rotation.x = currentRotation.current
    }

    const scrollActive = isScrolling.current
    const flameBaseScale = scrollActive ? 1.0 : 0.3
    const flickerSpeed = scrollActive ? 30 : 8
    const flickerAmt = scrollActive ? 0.25 : 0.05

    if (flameOuter.current) {
      const s = flameBaseScale + Math.sin(t * flickerSpeed) * flickerAmt + Math.sin(t * flickerSpeed * 1.7) * flickerAmt * 0.5
      flameOuter.current.scale.set(s * 0.9, s, s * 0.9)
      flameOuter.current.rotation.y = t * 5
    }
    if (flameInner.current) {
      const s = flameBaseScale * 0.8 + Math.sin(t * flickerSpeed * 1.3 + 1) * flickerAmt * 0.8
      flameInner.current.scale.set(s * 0.7, s * 1.1, s * 0.7)
      flameInner.current.rotation.y = -t * 7
    }
    if (flameCore.current) {
      const s = flameBaseScale * 0.5 + Math.sin(t * flickerSpeed * 2) * flickerAmt * 0.4
      flameCore.current.scale.set(s * 0.5, s * 1.2, s * 0.5)
    }
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <group ref={rocketBody} scale={0.75}>
        {/* Nose cone */}
        <mesh position={[0, 2.2, 0]}>
          <coneGeometry args={[0.32, 0.85, 32]} />
          <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.65, 0]}>
          <coneGeometry args={[0.06, 0.15, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.78, 0]}>
          <torusGeometry args={[0.33, 0.025, 16, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#991b1b" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Main body */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.33, 0.33, 2.2, 32]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.25} />
        </mesh>

        {/* Porthole */}
        <mesh position={[0, 1.1, 0.32]}>
          <circleGeometry args={[0.14, 32]} />
          <meshStandardMaterial color="#0c4a6e" metalness={0.9} roughness={0.05} />
        </mesh>
        <mesh position={[0, 1.1, 0.325]}>
          <torusGeometry args={[0.155, 0.02, 16, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[-0.04, 1.15, 0.33]}>
          <circleGeometry args={[0.035, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} transparent opacity={0.5} />
        </mesh>

        {/* Band */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 32]} />
          <meshStandardMaterial color="#6366f1" metalness={0.5} roughness={0.25} />
        </mesh>

        {/* Lower body */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.33, 0.37, 0.6, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.35} roughness={0.3} />
        </mesh>

        {/* Fins */}
        {[0, 120, 240].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <group key={i} position={[Math.cos(rad) * 0.33, -0.65, Math.sin(rad) * 0.33]} rotation={[0, -rad, 0]}>
              <mesh position={[0.15, 0, 0]} rotation={[0, 0, 0.15]}>
                <boxGeometry args={[0.28, 0.5, 0.04]} />
                <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
              </mesh>
            </group>
          )
        })}

        {/* Nozzle */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.28, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.2, 0.28, 0.15, 32]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.15} />
        </mesh>

        {/* Flames */}
        <group ref={flameOuter} position={[0, -1.2, 0]}>
          <mesh>
            <coneGeometry args={[0.22, 0.8, 12]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={2} transparent opacity={0.7} />
          </mesh>
        </group>
        <group ref={flameInner} position={[0, -1.25, 0]}>
          <mesh>
            <coneGeometry args={[0.13, 0.65, 10]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={3} transparent opacity={0.8} />
          </mesh>
        </group>
        <group ref={flameCore} position={[0, -1.15, 0]}>
          <mesh>
            <coneGeometry args={[0.06, 0.4, 8]} />
            <meshStandardMaterial color="#fef3c7" emissive="#ffffff" emissiveIntensity={4} transparent opacity={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default function ScrollRocket() {
  const containerRef = useRef(null)
  const isScrolling = useRef(false)
  const scrollDirection = useRef(1)
  const scrollTimeout = useRef(null)
  const targetY = useRef(0)
  const currentY = useRef(0)
  const currentX = useRef(0)
  const currentOpacity = useRef(0)
  const targetOpacity = useRef(0)
  const lastScrollY = useRef(0)
  const rafId = useRef(null)

  const animate = useCallback(() => {
    currentY.current += (targetY.current - currentY.current) * 0.06
    currentOpacity.current += (targetOpacity.current - currentOpacity.current) * 0.04

    const progress = targetY.current / (window.innerHeight * 0.75 || 1)
    const sWave = Math.sin(progress * Math.PI * 3) * 20
    currentX.current += (sWave - currentX.current) * 0.05

    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(${currentY.current}px) translateX(${currentX.current}px)`
      containerRef.current.style.opacity = `${currentOpacity.current}`
    }
    rafId.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate)
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [animate])

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      const scrollY = window.scrollY

      // Fade in after hero section
      const heroProgress = Math.min(scrollY / heroHeight, 1)
      targetOpacity.current = heroProgress < 0.7 ? 0 : (heroProgress - 0.7) / 0.3

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const percent = maxScroll > 0 ? scrollY / maxScroll : 0
      const viewportRange = window.innerHeight * 0.75
      targetY.current = percent * viewportRange

      const delta = scrollY - lastScrollY.current
      if (Math.abs(delta) > 1) {
        scrollDirection.current = delta > 0 ? 1 : -1
      }
      lastScrollY.current = scrollY

      isScrolling.current = true
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
      }, 150)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed top-4 right-[2%] z-40 w-[8vw] max-w-16 h-28 hidden md:block"
      style={{ willChange: 'transform, opacity', opacity: 0 }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 35 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 5]} intensity={1.2} />
        <pointLight position={[-2, 2, 3]} intensity={0.3} color="#6366f1" />
        <pointLight position={[0, 3, 2]} intensity={0.5} color="#f97316" />
        <Rocket isScrolling={isScrolling} scrollDirection={scrollDirection} />
      </Canvas>
    </div>
  )
}
