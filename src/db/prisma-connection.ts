import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量，使用绝对路径确保正确加载
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
  debug: true
});

export interface PrismaConnection {
  client: PrismaClient;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  testConnection: () => Promise<boolean>;
}

class PrismaConnectionImpl implements PrismaConnection {
  private static instance: PrismaConnectionImpl;
  public client: PrismaClient;

  private constructor() {
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
      connectTimeout: 30000, // 增加连接超时时间
      idleTimeout: 60000, // 增加空闲连接超时时间
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    };

    // 创建MariaDB连接池
    const pool = mariadb.createPool(poolConfig);

    // 测试连接池是否能正常工作
    this.testPoolConnection(pool).catch(error => {
      console.error('连接池测试失败，应用程序将退出:', error);
      process.exit(1);
    });

    // 创建PrismaMariaDb适配器
    const adapter = new PrismaMariaDb(pool);

    // 使用适配器创建PrismaClient实例
    this.client = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      adapter
    });
  }

  // 测试连接池是否能正常工作
  private async testPoolConnection(pool: mariadb.Pool) {
    try {
      const connection = await pool.getConnection();
      console.log('成功从连接池获取连接');
      await connection.release();
      console.log('成功将连接释放回连接池');
      return true;
    } catch (error) {
      console.error('连接池测试失败:', error);
      throw error;
    }
  }

  // 获取单例实例
  public static getInstance(): PrismaConnectionImpl {
    if (!PrismaConnectionImpl.instance) {
      PrismaConnectionImpl.instance = new PrismaConnectionImpl();
    }
    return PrismaConnectionImpl.instance;
  }

  // 连接数据库
  public async connect(): Promise<void> {
    try {
      await this.client.$connect();
      console.log('Prisma client已连接到数据库');
    } catch (error) {
      console.error('连接数据库失败:', error);
      throw error;
    }
  }

  // 断开数据库连接
  public async disconnect(): Promise<void> {
    try {
      await this.client.$disconnect();
      console.log('Prisma client已断开数据库连接');
    } catch (error) {
      console.error('断开数据库连接失败:', error);
      throw error;
    }
  }

  // 测试数据库连接
  public async testConnection(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('数据库连接测试失败:', error);
      return false;
    }
  }
}

// 导出Prisma连接实例和类型
export const prismaConnection: PrismaConnection = PrismaConnectionImpl.getInstance();
export const prisma: PrismaClient = prismaConnection.client;
