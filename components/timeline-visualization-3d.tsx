"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Text, Float, PerspectiveCamera } from "@react-three/drei"
import { motion } from "framer-motion-3d"
import { MotionConfig } from "framer-motion"
import { useTheme } from "next-themes"

function TimelineSphere({ position, era, color, onClick, isActive }: any) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <motion.mesh
        position={position}
        animate={{
          scale: isActive ? 1.2 : 1,
        }}
        onClick={onClick}
        whileHover={{ scale: isActive ? 1.2 : 1.1 }}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={isActive ? 0.5 : 0.1}
        />
        <Text
          position={[0, 0.7, 0]}
          fontSize={0.15}
          color={isDark ? "white" : "black"}
          anchorX="center"
          anchorY="middle"
        >
          {era}
        </Text>
      </motion.mesh>
    </Float>
  )
}

function TimelineConnection({ start, end, color }: any) {
  return (
    <mesh>
      <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </mesh>
  )
}

export default function TimelineVisualization3D({ eras, descriptions, activeEra, setActiveEra }: any) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden">
      <MotionConfig transition={{ duration: 0.5 }}>
        <Canvas>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 1, 8]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            {/* Timeline spheres */}
            {eras.map((era: any, index: number) => (
              <TimelineSphere
                key={index}
                position={era.position}
                era={era.name}
                color={era.color}
                onClick={() => setActiveEra(index)}
                isActive={activeEra === index}
              />
            ))}

            {/* Timeline connections */}
            {eras.slice(0, -1).map((era: any, index: number) => {
              const nextEra = eras[index + 1]
              const direction = [
                nextEra.position[0] - era.position[0],
                nextEra.position[1] - era.position[1],
                nextEra.position[2] - era.position[2],
              ]
              const distance = Math.sqrt(
                direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2],
              )
              const midpoint = [
                (era.position[0] + nextEra.position[0]) / 2,
                (era.position[1] + nextEra.position[1]) / 2,
                (era.position[2] + nextEra.position[2]) / 2,
              ]

              // Calculate rotation to point from one sphere to the next
              const phi = Math.atan2(direction[2], direction[0])
              const theta = Math.atan2(
                Math.sqrt(direction[0] * direction[0] + direction[2] * direction[2]),
                direction[1],
              )
              const rotation = [Math.PI / 2 - theta, 0, -phi]

              return (
                <mesh key={index} position={midpoint} rotation={rotation} scale={[1, distance, 1]}>
                  <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                  <meshStandardMaterial color="#FF7A28" transparent opacity={0.6} />
                </mesh>
              )
            })}

            {/* Description text for active era */}
            <motion.group
              position={[0, -1.5, 0]}
              animate={{
                y: -1.5,
                opacity: 1,
              }}
            >
              <Text
                position={[0, 0, 0]}
                fontSize={0.3}
                color={isDark ? "white" : "black"}
                anchorX="center"
                anchorY="middle"
                maxWidth={5}
                textAlign="center"
              >
                {descriptions[activeEra]}
              </Text>
            </motion.group>
          </Suspense>
        </Canvas>
      </MotionConfig>
    </div>
  )
}
