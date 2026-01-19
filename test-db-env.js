const dotenv = require('dotenv');
const path = require('path');

// 加载.env文件，使用绝对路径
const result = dotenv.config({
  path: path.resolve(__dirname, '.env')
});

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

// 打印数据库相关的环境变量
console.log('MYSQL_USERNAME:', process.env.MYSQL_USERNAME);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_PORT:', process.env.MYSQL_PORT);
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);

// 打印系统的USERNAME环境变量
console.log('SYSTEM USERNAME:', process.env.USERNAME);