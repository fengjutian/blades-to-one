const dotenv = require('dotenv');
const path = require('path');

// 手动加载.env文件
const result = dotenv.config({ path: path.resolve(__dirname, '.env'), debug: true });

console.log('dotenv加载结果:', result);
console.log('MYSQL_USERNAME:', process.env.MYSQL_USERNAME);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_PORT:', process.env.MYSQL_PORT);
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
console.log('所有环境变量:', process.env);
