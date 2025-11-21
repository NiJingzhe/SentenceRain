import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import type { Sentence } from '../types/index.ts';

interface SentenceObjectProps {
  sentence: Sentence;
  onRemove: (id: number) => void;
}

const SentenceObject: React.FC<SentenceObjectProps> = ({ sentence, onRemove }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [opacity, setOpacity] = useState(0);

  // 淡入效果
  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setOpacity(1);
    }, 100);

    return () => clearTimeout(fadeInTimer);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // 更新位置（向用户的方向移动）
      meshRef.current.position.z += sentence.velocity * delta * 5;

      // 计算距离相机的z距离
      const distanceToCamera = Math.abs(meshRef.current.position.z - 25); // 相机z位置为25

      // 根据距离计算透明度
      let distanceOpacity = 1;
      if (distanceToCamera > 40) {
        // 距离太远时逐渐透明
        distanceOpacity = Math.max(0, 1 - (distanceToCamera - 40) / 30);
      } else if (distanceToCamera < 5) {
        // 距离太近时逐渐透明
        distanceOpacity = Math.max(0, (distanceToCamera - 2) / 3);
      }

      // 更新透明度（结合淡入淡出效果和距离效果）
      const finalOpacity = opacity * distanceOpacity;
      if (Array.isArray(meshRef.current.material)) {
        meshRef.current.material.forEach(material => {
          material.opacity = finalOpacity;
        });
      } else {
        meshRef.current.material.opacity = finalOpacity;
      }

      // 当句子移动到一定距离时，移除它
      if (meshRef.current.position.z > 75) {
        // 淡出效果
        setOpacity(prev => Math.max(0, prev - 0.05));

        // 完全透明后移除
        if (opacity <= 0.05) {
          onRemove(sentence.id);
        }
      }
    }
  });

  return (
    <Text
      ref={meshRef}
      position={sentence.position}
      color={sentence.color}
      fontSize={0.8}
      maxWidth={20}
      lineHeight={1}
      textAlign="center"
    >
      {sentence.text}
    </Text>
  );
};

interface SentenceRainProps {
  sentences: string[];
  color: string;
  speed: number;
  density: number;
}

const SentenceRainScene: React.FC<SentenceRainProps> = ({ sentences, color, speed, density }) => {
  const [activeSentences, setActiveSentences] = useState<Sentence[]>([]);
  const idCounter = useRef(0);
  
  // 使用 ref 存储当前的句子池，避免更新时影响已有句子
  const sentencesPoolRef = useRef<string[]>(sentences);
  const speedRef = useRef(speed);
  const densityRef = useRef(density);

  // 生成随机颜色的函数
  const getRandomColor = () => {
    const colors = [
      '#ffffff', // 白色
      '#ffcccc', // 浅红色
      '#ccffcc', // 浅绿色
      '#ccccff', // 浅蓝色
      '#ffffcc', // 浅黄色
      '#ffccff', // 浅紫色
      '#ccffff', // 浅青色
      '#ffd700', // 金色
      '#ffa07a', // 浅橙色
      '#98fb98', // 淡绿色
      '#87cefa', // 天蓝色
      '#dda0dd', // 梅花色
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 更新句子池、速度和密度（不影响已有句子）
  useEffect(() => {
    sentencesPoolRef.current = sentences;
    speedRef.current = speed;
    densityRef.current = density;
  }, [sentences, speed, density]);

  // 生成新句子的逻辑（独立于句子池更新）
  // 当 density 变化时重新设置 interval，但不会清空已有句子
  useEffect(() => {
    const generateNewSentence = () => {
      const currentSentences = sentencesPoolRef.current;
      const currentSpeed = speedRef.current;
      
      if (currentSentences.length > 0) {
        const randomIndex = Math.floor(Math.random() * currentSentences.length);
        const selectedText = currentSentences[randomIndex];
        
        const newSentence: Sentence = {
          id: idCounter.current++,
          text: selectedText,
          position: [
            (Math.random() - 0.5) * 40, // 随机x位置
            (Math.random() - 0.5) * 20, // 随机y位置
            -80, // 从较近的位置开始
          ],
          velocity: currentSpeed * (0.5 + Math.random()), // 随机速度
          opacity: 0,
          color: getRandomColor(), // 使用随机颜色
        };

        setActiveSentences(prev => [...prev, newSentence]);
      }
    };

    // 根据当前密度设置生成频率
    const intervalTime = 500 / density;
    const interval = setInterval(generateNewSentence, intervalTime);

    return () => clearInterval(interval);
  }, [density]); // 只在 density 变化时重新设置 interval

  const handleRemoveSentence = (id: number) => {
    setActiveSentences(prev => prev.filter(sentence => sentence.id !== id));
  };

  return (
    <>
      {activeSentences.map((sentence) => (
        <SentenceObject
          key={sentence.id}
          sentence={sentence}
          onRemove={handleRemoveSentence}
        />
      ))}
    </>
  );
};

interface SentenceRainCanvasProps {
  sentences: string[];
  color: string;
  speed: number;
  density: number;
}

const SentenceRainCanvas: React.FC<SentenceRainCanvasProps> = ({ sentences, color, speed, density }) => {
  return (
    <Canvas className="sentence-rain-canvas" camera={{ position: [0, 0, 25], fov: 60, rotation: [0, 0, 0] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <SentenceRainScene
        sentences={sentences}
        color={color}
        speed={speed}
        density={density}
      />
    </Canvas>
  );
};

export default SentenceRainCanvas;