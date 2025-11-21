import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import SentenceRainCanvas from './components/SentenceRain';
import ConfigPage from './components/ConfigPage';
import type { ControlParams } from './types/index.ts';
import { fetchControlParams, updateControlParams } from './services/api';

// 创建一个自定义组件来处理主页逻辑
function HomePage({ controlParams }: { controlParams: ControlParams }) {
  return (
    <div className="main-page">
      <div className="canvas-container">
        <SentenceRainCanvas
          sentences={controlParams.sentences}
          color={controlParams.color}
          speed={controlParams.speed}
          density={controlParams.density}
        />
      </div>
    </div>
  );
}

// 创建一个内部组件来处理路由和数据管理
function AppContent() {
  const getDefaultControlParams = (): ControlParams => ({
    sentences: [
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
    ],
    color: '#ffffff',
    speed: 2.8,
    density: 4,
  });

  const [controlParams, setControlParams] = useState<ControlParams | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  // 组件挂载时从后端获取数据
  useEffect(() => {
    const loadControlParams = async () => {
      const params = await fetchControlParams();
      // 只有在成功获取到数据时才更新，失败时保持当前数据不变
      if (params !== null) {
        setControlParams(params);
        setIsInitialized(true);
      } else if (!isInitialized) {
        // 如果初始化失败，使用默认值（仅用于首次加载）
        setControlParams(getDefaultControlParams());
        setIsInitialized(true);
      }
    };

    loadControlParams();

    // 定时查询最新的配置数据（每2秒查询一次）
    // 但是当用户在配置页面时，不自动刷新，避免干扰用户编辑
    const interval = setInterval(() => {
      // 如果当前不在配置页面，才自动刷新
      if (location.pathname !== '/config') {
        loadControlParams();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [location.pathname, isInitialized]);

  const handleControlChange = async (newControl: ControlParams) => {
    setControlParams(newControl);

    // 更新后端数据
    await updateControlParams(newControl);
  };

  // 如果数据还没加载完成，显示加载状态
  if (!isInitialized || controlParams === null) {
    return (
      <div className="app">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage controlParams={controlParams} />} />
        <Route path="/config" element={
          <ConfigPage
            controlParams={controlParams}
            onControlChange={handleControlChange}
          />
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;