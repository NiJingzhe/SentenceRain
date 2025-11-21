// 根据环境选择 API 基础 URL
// 如果当前 hostname 是 localhost 或 127.0.0.1，直接访问后端
// 否则使用相对路径，让 Vite 代理或服务器处理（适用于 ngrok 等外部访问）
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // 如果是 localhost 或 127.0.0.1，直接访问后端
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
  }
  // 其他情况（包括 ngrok、生产环境等）使用相对路径
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface ControlParams {
  sentences: string[];
  color: string;
  speed: number;
  density: number;
}

export const fetchControlParams = async (): Promise<ControlParams | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sentences`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // 确保返回的数据格式正确
    if (data && Array.isArray(data.sentences)) {
      return data;
    }
    throw new Error('Invalid data format');
  } catch (error) {
    console.error('获取配置数据失败:', error);
    // 不再返回默认值，而是返回 null，让调用者处理
    return null;
  }
};

export const updateControlParams = async (params: ControlParams): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sentences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentences: params.sentences,
        color: params.color,
        speed: params.speed,
        density: params.density,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success;
  } catch {
    return false;
  }
};