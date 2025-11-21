import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// 数据文件路径
const dataFilePath = path.join(__dirname, 'data.json');

// 默认的配置数据
const defaultData = {
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
};

// 读取数据文件
async function loadData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const parsed = JSON.parse(data);
    // 验证数据格式
    if (parsed && Array.isArray(parsed.sentences)) {
      return parsed;
    }
    throw new Error('Invalid data format');
  } catch (error) {
    // 只有在文件不存在时才创建默认文件
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // 文件不存在，创建默认文件
      await saveData(defaultData);
      return defaultData;
    }
    // 其他错误（如 JSON 解析错误）应该抛出，而不是返回默认数据
    throw error;
  }
}

// 保存数据到文件
async function saveData(data: typeof defaultData) {
  try {
    // 确保目录存在
    const dir = path.dirname(dataFilePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
}

// 中间件
// 配置 CORS，允许所有来源（开发环境）
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '../dist')));

// 获取当前配置数据
app.get('/api/sentences', async (req, res) => {
  try {
    const data = await loadData();
    res.json(data);
  } catch (error) {
    console.error('读取数据失败:', error);
    // 只有在文件不存在时才返回默认数据，其他错误返回 500
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      res.json(defaultData);
    } else {
      res.status(500).json({ error: '读取数据失败', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
});

// 更新配置数据
app.post('/api/sentences', async (req, res) => {
  try {
    const { sentences, color, speed, density } = req.body;
    
    // 读取现有数据
    const currentData = await loadData();
    
    // 更新数据
    const updatedData = {
      sentences: Array.isArray(sentences) ? sentences : currentData.sentences,
      color: color || currentData.color,
      speed: speed !== undefined ? speed : currentData.speed,
      density: density !== undefined ? density : currentData.density,
    };
    
    // 保存到文件
    const success = await saveData(updatedData);
    
    if (success) {
      res.json({ success: true, message: '配置数据已更新' });
  } else {
      res.status(500).json({ success: false, message: '保存数据失败' });
    }
  } catch (error) {
    console.error('更新数据失败:', error);
    res.status(500).json({ success: false, message: '更新数据失败' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});