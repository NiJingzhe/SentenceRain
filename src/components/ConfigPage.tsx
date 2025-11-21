import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import type { ControlParams } from '../types/index.ts';

interface ConfigPageProps {
  controlParams: ControlParams;
  onControlChange: (control: ControlParams) => void;
}

const ConfigPage: React.FC<ConfigPageProps> = ({ controlParams, onControlChange }) => {
  const [localControlParams, setLocalControlParams] = useState<ControlParams>(controlParams);

  // 当 controlParams 变化时更新本地状态
  useEffect(() => {
    setLocalControlParams(controlParams);
  }, [controlParams]);

  const handleControlChange = (newControl: ControlParams) => {
    setLocalControlParams(newControl);
    // 直接保存，不需要返回
    onControlChange(newControl);
  };

  return (
    <div className="config-page">
      <div className="config-container">
        <h1>句子雨点配置</h1>
        <Controls
          sentences={localControlParams.sentences}
          color={localControlParams.color}
          speed={localControlParams.speed}
          density={localControlParams.density}
          onControlChange={handleControlChange}
        />
      </div>
    </div>
  );
};

export default ConfigPage;