import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// @ts-ignore

interface StarProps {
  position: [number, number, number];
}

const Star: React.FC<StarProps> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialScale = useMemo(() => Math.random() * 0.5 + 0.1, []);

  useFrame((state) => {
    if (meshRef.current) {
      // 随机闪烁效果
      meshRef.current.scale.setScalar(initialScale + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
  );
};

const Starfield: React.FC = () => {
  // 创建大量星星
  const stars = useMemo(() => {
    const starArray = [];
    for (let i = 0; i < 1000; i++) {
      starArray.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * -200, // 星星在远处
        ] as [number, number, number],
      });
    }
    return starArray;
  }, []);

  return (
    <>
      {stars.map((star) => (
        <Star key={star.id} position={star.position} />
      ))}
    </>
  );
};

const StarfieldBackground: React.FC = () => {
  return (
    <Canvas className="starfield-canvas">
      <ambientLight intensity={0.1} />
      <Starfield />
    </Canvas>
  );
};

export default StarfieldBackground;