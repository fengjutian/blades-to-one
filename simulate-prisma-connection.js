const dotenv = require('dotenv');
const path = require('path');
const mysql2 = require('mysql2/promise');

// 加载.env文件，使用绝对路径
const result = dotenv.config({
  path: path.resolve(__dirname, '.env')
});

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

// 模拟prisma-connection.ts的行为
class SimulatedPrismaConnection {
  constructor() {
    // 打印所有环境变量，用于调试
    console.log('All environment variables:', process.env);

    // 从环境变量获取数据库连接参数
    const username = process.env.MYSQL_USERNAME;
    const password = process.env.MYSQL_PASSWORD;
    const host = process.env.MYSQL_HOST;
    const port = Number(process.env.MYSQL_PORT);
    const database = process.env.MYSQL_DATABASE;

    console.log('数据库连接参数:', {
      username,
      host,
      port,
      database,
      password: password ? '******' : '未设置'
    });

    // 验证必要的连接参数
    if (!username || !password || !host || !port || !database) {
      throw new Error('缺少必要的数据库连接参数');
    }

    // 创建连接池配置
    const poolConfig = {
      host,
      port,
      user: username,
      password,
      database,
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
      connectTimeout: 30000,
      idleTimeout: 60000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    };

    console.log('连接池配置:', poolConfig);

    // 尝试创建连接池
    this.pool = mysql2.createPool(poolConfig);
  }

  // 测试连接
  async testConnection() {
    try {
      console.log('尝试获取连接...');
      const connection = await this.pool.getConnection();
      console.log('成功获取连接，连接信息:', connection.config);
      await connection.release();
      console.log('连接已释放');
      return true;
    } catch (error) {
      console.error('连接测试失败:', error);
      return false;
    }
  }
}

// 创建实例并测试连接
async function main() {
  try {
    console.log('创建模拟连接...');
    const connection = new SimulatedPrismaConnection();
    console.log('连接实例创建成功');
    
    console.log('\n测试连接...');
    const success = await connection.testConnection();
    console.log('连接测试结果:', success);
  } catch (error) {
    console.error('创建连接失败:', error);
  }
}

main();