import { Pool } from 'mysql2/promise';
import { Pool as PgPool } from 'pg';
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
export declare class DatabaseManager {
    private mysqlPool;
    private pgPool;
    /**
     * 获取 MySQL 连接池
     */
    getMySQLPool(): Pool;
    /**
     * 获取 PostgreSQL 连接池
     */
    getPostgreSQLPool(): PgPool;
    /**
     * 关闭所有数据库连接池
     */
    closeAllPools(): Promise<void>;
    /**
     * 测试 MySQL 连接
     */
    testMySQLConnection(): Promise<boolean>;
    /**
     * 测试 PostgreSQL 连接
     */
    testPostgreSQLConnection(): Promise<boolean>;
}
export declare const dbManager: DatabaseManager;
export default dbManager;
