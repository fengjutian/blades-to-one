import { createPool, Pool } from 'mysql2/promise';
import { Pool as PgPool, Client as PgClient } from 'pg';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 数据库配置接口
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  [key: string]: any;
}

/**
 * 数据库连接管理类
 */
export class DatabaseManager {
  private mysqlPool: Pool | null = null;
  private pgPool: PgPool | null = null;

  /**
   * 获取 MySQL 连接池
   */
  public getMySQLPool(): Pool {
    if (!this.mysqlPool) {
      const config: DatabaseConfig = {
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306', 10),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || '',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      };

      this.mysqlPool = createPool(config);
      console.log('MySQL 连接池已创建');
    }

    return this.mysqlPool;
  }

  /**
   * 获取 PostgreSQL 连接池
   */
  public getPostgreSQLPool(): PgPool {
    if (!this.pgPool) {
      const config = {
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT || '5432', 10),
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || '',
        database: process.env.PG_DATABASE || '',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };

      this.pgPool = new PgPool(config);
      console.log('PostgreSQL 连接池已创建');

      // 监听连接错误
      this.pgPool.on('error', (err: Error) => {
        console.error('PostgreSQL 连接池错误:', err.message);
      });
    }

    return this.pgPool;
  }

  /**
   * 关闭所有数据库连接池
   */
  public async closeAllPools(): Promise<void> {
    if (this.mysqlPool) {
      await this.mysqlPool.end();
      this.mysqlPool = null;
      console.log('MySQL 连接池已关闭');
    }

    if (this.pgPool) {
      await this.pgPool.end();
      this.pgPool = null;
      console.log('PostgreSQL 连接池已关闭');
    }
  }

  /**
   * 测试 MySQL 连接
   */
  public async testMySQLConnection(): Promise<boolean> {
    try {
      const pool = this.getMySQLPool();
      const [rows] = await pool.execute('SELECT 1 + 1 AS result');
      console.log('MySQL 连接测试成功:', rows);
      return true;
    } catch (error) {
      console.error('MySQL 连接测试失败:', error);
      return false;
    }
  }

  /**
   * 测试 PostgreSQL 连接
   */
  public async testPostgreSQLConnection(): Promise<boolean> {
    try {
      const pool = this.getPostgreSQLPool();
      const client = await pool.connect();
      const res = await client.query('SELECT $1::text as result', [
        'PostgreSQL 连接测试成功',
      ]);
      console.log(res.rows[0].result);
      client.release();
      return true;
    } catch (error) {
      console.error('PostgreSQL 连接测试失败:', error);
      return false;
    }
  }
}

// 创建单例实例
export const dbManager = new DatabaseManager();

export default dbManager;
