// 测试完整的环境变量加载流程
// 模拟应用程序启动时的加载顺序

console.log('=== 测试完整的环境变量加载流程 ===');

// 首先加载config.ts
console.log('\n1. 加载config.ts...');
const dotenv = require('dotenv');
const path = require('path');

// 模拟config.ts中的环境变量加载
dotenv.config({
  path: path.resolve(__dirname, './src/router/config.ts')
});

console.log('   加载config.ts后，MYSQL_USERNAME:', process.env.MYSQL_USERNAME);

// 然后加载prisma.config.ts
console.log('\n2. 加载prisma.config.ts...');
dotenv.config({
  path: path.resolve(__dirname, './prisma.config.ts')
});

console.log('   加载prisma.config.ts后，MYSQL_USERNAME:', process.env.MYSQL_USERNAME);

// 然后加载auth-service.ts
console.log('\n3. 加载auth-service.ts...');
dotenv.config({
  path: path.resolve(__dirname, './src/router/auth/auth-service.ts')
});

console.log('   加载auth-service.ts后，MYSQL_USERNAME:', process.env.MYSQL_USERNAME);

// 最后加载prisma-connection.ts
console.log('\n4. 加载prisma-connection.ts...');
// 注意：这里不是直接加载ts文件，而是模拟其行为
const result = dotenv.config({
  path: path.resolve(__dirname, '.env')
});

if (result.error) {
  console.error('   Error loading .env file:', result.error);
} else {
  console.log('   .env文件加载成功');
}

console.log('   最终MYSQL_USERNAME:', process.env.MYSQL_USERNAME);
console.log('   最终USERNAME:', process.env.USERNAME);

// 检查是否存在默认的数据库连接URL
console.log('\n=== 检查默认的数据库连接配置 ===');
const username = process.env.MYSQL_USERNAME || process.env.USERNAME;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST || 'localhost';
const port = process.env.MYSQL_PORT || 3306;
const database = process.env.MYSQL_DATABASE || 'blades_to_one_database';

console.log('使用的数据库连接参数:');
console.log('  用户名:', username);
console.log('  密码:', password ? '******' : '未设置');
console.log('  主机:', host);
console.log('  端口:', port);
console.log('  数据库:', database);

// 检查是否有冲突的环境变量
console.log('\n=== 检查可能冲突的环境变量 ===');
const envKeys = Object.keys(process.env).filter(key => 
  key.toLowerCase().includes('user') || key.toLowerCase().includes('pass')
);

console.log('与用户或密码相关的环境变量:');
envKeys.forEach(key => {
  const value = key.toLowerCase().includes('pass') ? '******' : process.env[key];
  console.log(`  ${key}: ${value}`);
});