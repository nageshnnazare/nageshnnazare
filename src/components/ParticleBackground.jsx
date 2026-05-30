import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Trail } from '@react-three/drei'
import * as THREE from 'three'

function MouseLight() {
  const light = useRef()
  const { viewport } = useThree()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useFrame(() => {
    if (light.current) {
      light.current.position.x = mouse.x * viewport.width * 0.5
      light.current.position.y = mouse.y * viewport.height * 0.5
    }
  })

  return <pointLight ref={light} intensity={2} color="#6366f1" distance={15} />
}

function FloatingOrbs() {
  const orbs = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5,
      ],
      scale: Math.random() * 0.8 + 0.3,
      speed: Math.random() * 0.5 + 0.2,
      color: ['#6366f1', '#06b6d4', '#818cf8', '#22d3ee', '#a78bfa', '#67e8f9'][i],
    }))
  }, [])

  return orbs.map((orb, i) => (
    <Float key={i} speed={orb.speed} rotationIntensity={0.5} floatIntensity={2}>
      <mesh position={orb.position} scale={orb.scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={orb.color}
          transparent
          opacity={0.15}
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </mesh>
    </Float>
  ))
}

function GridFloor() {
  const grid = useRef()

  useFrame((state) => {
    if (grid.current) {
      grid.current.position.z = (state.clock.elapsedTime * 0.5) % 2
    }
  })

  return (
    <group ref={grid} position={[0, -12, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>
      <gridHelper args={[80, 60, '#111133', '#080818']} />
    </group>
  )
}

function createCircleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

function WarpParticles({ count = 500 }) {
  const mesh = useRef()
  const circleMap = useMemo(() => createCircleTexture(), [])

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
      velocities[i] = Math.random() * 0.02 + 0.01
    }
    return { positions, velocities }
  }, [count])

  useFrame((state) => {
    const posArray = mesh.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 2] += velocities[i]
      if (posArray[i * 3 + 2] > 20) {
        posArray[i * 3 + 2] = -20
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
    mesh.current.rotation.z = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial map={circleMap} size={0.08} color="#6366f1" transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 10, 40]} />
        <ambientLight intensity={0.2} />
        <MouseLight />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#06b6d4" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#6366f1" />
        <FloatingOrbs />
        <WarpParticles count={450} />
        <GridFloor />
      </Canvas>
    </div>
  )
}
