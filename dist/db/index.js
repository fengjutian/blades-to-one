"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbManager = exports.DatabaseManager = void 0;
const promise_1 = require("mysql2/promise");
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// 加载环境变量
dotenv_1.default.config();
/**
 * 数据库连接管理类
 */
class DatabaseManager {
    constructor() {
        this.mysqlPool = null;
        this.pgPool = null;
    }
    /**
     * 获取 MySQL 连接池
     */
    getMySQLPool() {
        if (!this.mysqlPool) {
            const config = {
                host: process.env.MYSQL_HOST || 'localhost',
                port: parseInt(process.env.MYSQL_PORT || '3306', 10),
                user: process.env.MYSQL_USER || 'root',
                password: process.env.MYSQL_PASSWORD || '',
                database: process.env.MYSQL_DATABASE || '',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            };
            this.mysqlPool = (0, promise_1.createPool)(config);
            console.log('MySQL 连接池已创建');
        }
        return this.mysqlPool;
    }
    /**
     * 获取 PostgreSQL 连接池
     */
    getPostgreSQLPool() {
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
            this.pgPool = new pg_1.Pool(config);
            console.log('PostgreSQL 连接池已创建');
            // 监听连接错误
            this.pgPool.on('error', (err) => {
                console.error('PostgreSQL 连接池错误:', err.message);
            });
        }
        return this.pgPool;
    }
    /**
     * 关闭所有数据库连接池
     */
    async closeAllPools() {
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
    async testMySQLConnection() {
        try {
            const pool = this.getMySQLPool();
            const [rows] = await pool.execute('SELECT 1 + 1 AS result');
            console.log('MySQL 连接测试成功:', rows);
            return true;
        }
        catch (error) {
            console.error('MySQL 连接测试失败:', error);
            return false;
        }
    }
    /**
     * 测试 PostgreSQL 连接
     */
    async testPostgreSQLConnection() {
        try {
            const pool = this.getPostgreSQLPool();
            const client = await pool.connect();
            const res = await client.query('SELECT $1::text as result', [
                'PostgreSQL 连接测试成功',
            ]);
            console.log(res.rows[0].result);
            client.release();
            return true;
        }
        catch (error) {
            console.error('PostgreSQL 连接测试失败:', error);
            return false;
        }
    }
}
exports.DatabaseManager = DatabaseManager;
// 创建单例实例
exports.dbManager = new DatabaseManager();
exports.default = exports.dbManager;
