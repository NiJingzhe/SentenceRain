import React, { useState, useEffect } from 'react';

interface ControlsProps {
  sentences: string[];
  color: string;
  speed: number;
  density: number;
  onControlChange: (control: { sentences: string[]; color: string; speed: number; density: number }) => void;
}

const Controls: React.FC<ControlsProps> = ({ sentences, color, speed, density, onControlChange }) => {
  const [localSentences, setLocalSentences] = useState<string[]>(sentences);
  const [localSpeed, setLocalSpeed] = useState<number>(speed);
  const [localDensity, setLocalDensity] = useState<number>(density);

  // 当props变化时更新本地状态
  useEffect(() => {
    setLocalSentences(sentences);
    setLocalSpeed(speed);
    setLocalDensity(density);
  }, [sentences, speed, density]);

  const handleSentencesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // 将输入框内容按行分割，保留所有行（包括空行）以便用户可以正常换行
    const lines = value.split('\n');
    // 保留所有行，允许用户在输入框中正常换行
    setLocalSentences(lines);
  };

  const handleApply = () => {
    // 在保存时过滤掉空行，只保留有效的句子
    const validSentences = localSentences.filter(line => line.trim() !== '');
    const newControl = {
      sentences: validSentences,
      color: color, // 使用传入的颜色，而不是本地状态
      speed: localSpeed,
      density: localDensity,
    };
    onControlChange(newControl);
  };

  const handleReset = () => {
    const defaultSentences = [
      "生活就像一盒巧克力",
      "你永远不知道下一颗是什么味道",
      "保持好奇心",
      "每一天都是新的开始",
      "相信自己，你可以做到",
      "梦想不会发光，发光的是追梦的你",
      "勇敢面对挑战",
      "每一次失败都是成长的机会",
      "微笑是最好的语言",
      "用心感受世界的美好"
    ];

    setLocalSentences(defaultSentences);
    setLocalSpeed(2.8);
    setLocalDensity(4);

    onControlChange({
      sentences: defaultSentences,
      color: '#ffffff',
      speed: 2.8,
      density: 4,
    });
  };

  return (
    <div className="controls-panel">
      <h2>句子雨点控制面板</h2>

      <div className="control-group">
        <label htmlFor="sentences">句子内容 (每行一个句子):</label>
        <textarea
          id="sentences"
          value={localSentences.join('\n')}
          onChange={handleSentencesChange}
          rows={6}
          placeholder="请输入句子，每行一个..."
        />
      </div>

      <div className="control-group">
        <label htmlFor="speed">下落速度: {localSpeed.toFixed(1)}</label>
        <input
          id="speed"
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={localSpeed}
          onChange={(e) => setLocalSpeed(parseFloat(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="density">密度: {localDensity}</label>
        <input
          id="density"
          type="range"
          min="1"
          max="20"
          step="1"
          value={localDensity}
          onChange={(e) => setLocalDensity(parseInt(e.target.value))}
        />
      </div>

      <div className="control-buttons">
        <button onClick={handleApply}>应用设置</button>
        <button onClick={handleReset}>重置默认</button>
      </div>
    </div>
  );
};

export default Controls;