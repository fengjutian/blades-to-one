// Bootstrap file to load environment variables before starting the application
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
// 使用 process.cwd() 确保从项目根目录加载 .env 文件
const projectRoot = process.cwd();
const envPath = path.resolve(projectRoot, '.env');

console.log('项目根目录:', projectRoot);
console.log('尝试加载 .env 文件:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
} else {
  console.log('.env file loaded successfully from:', envPath);
}

// Now start the application
import './index';