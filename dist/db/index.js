"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaConnection = exports.prisma = void 0;
// 导出Prisma连接和客户端实例
var prisma_connection_1 = require("./prisma-connection");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return prisma_connection_1.prisma; } });
Object.defineProperty(exports, "PrismaConnection", { enumerable: true, get: function () { return prisma_connection_1.prismaConnection; } });
