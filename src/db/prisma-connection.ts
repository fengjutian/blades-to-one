// 导入PrismaClient和相关类型
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mysql2/promise';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 定义PrismaConnection接口
export interface PrismaConnection {
  client: PrismaClient;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  testConnection: () => Promise<boolean>;
}

// 创建单例模式的PrismaClient实例
class PrismaConnectionImpl implements PrismaConnection {
  private static instance: PrismaConnectionImpl;
  public client: PrismaClient;

  private constructor() {
    // 从环境变量获取数据库URL
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // 创建MariaDB连接池
    const pool = mariadb.createPool(databaseUrl);

    // 创建PrismaMariaDb适配器
    const adapter = new PrismaMariaDb(pool);

    // 使用适配器创建PrismaClient实例
    this.client = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      adapter,
    });
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
      console.log('Prisma client connected to the database');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  // 断开数据库连接
  public async disconnect(): Promise<void> {
    try {
      await this.client.$disconnect();
      console.log('Prisma client disconnected from the database');
    } catch (error) {
      console.error('Failed to disconnect from the database:', error);
      throw error;
    }
  }

  // 测试数据库连接
  public async testConnection(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

// 导出Prisma连接实例和类型
export const prismaConnection: PrismaConnection = PrismaConnectionImpl.getInstance();
export const prisma: PrismaClient = prismaConnection.client;
