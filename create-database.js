const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    // 连接到MySQL服务器（不指定数据库）
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'fjt911008'
    });

    console.log('成功连接到MySQL服务器');

    // 创建数据库
    await connection.execute('CREATE DATABASE IF NOT EXISTS blades_to_one_database');
    console.log('数据库 blades_to_one_database 创建成功');

    // 关闭连接
    await connection.end();
    console.log('数据库设置完成');
  } catch (error) {
    console.error('错误:', error.message);
    console.error('请确保MySQL服务正在运行，并且用户名/密码正确');
  }
}

createDatabase();