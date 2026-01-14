import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// 构建MySQL连接字符串
const username = process.env.MYSQL_USERNAME || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const host = process.env.MYSQL_HOST || 'localhost';
const port = process.env.MYSQL_PORT || '3306';
const database = process.env.MYSQL_DATABASE || 'blades_to_one_database';

const databaseUrl = `mysql://${username}:${password}@${host}:${port}/${database}`;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
  client: {
    output: 'src/generated/prisma',
  },
});

