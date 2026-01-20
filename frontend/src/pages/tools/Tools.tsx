import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 定义工具类型
type ToolType = "function" | "api" | "local";

// 定义工具接口
interface Tool {
  id: string;
  name: string;
  description: string;
  type: ToolType;
  icon?: string;
  usage?: string;
}

// 工具数据
const toolsData: Tool[] = [
  {
    id: "func-1",
    name: "代码执行器",
    description: "执行JavaScript/TypeScript代码片段",
    type: "function",
    usage: "用于运行小型代码示例"
  },
  {
    id: "func-2",
    name: "数据查询",
    description: "查询数据库中的信息",
    type: "function",
    usage: "用于获取数据库中的数据"
  },
  {
    id: "api-1",
    name: "模型推理",
    description: "调用LLM模型进行推理",
    type: "api",
    usage: "用于生成文本或回答问题"
  },
  {
    id: "api-2",
    name: "网络请求",
    description: "发送HTTP请求获取外部数据",
    type: "api",
    usage: "用于调用外部API"
  },
  {
    id: "local-1",
    name: "文件搜索",
    description: "搜索本地文件系统",
    type: "local",
    usage: "用于查找本地文件"
  },
  {
    id: "local-2",
    name: "系统监控",
    description: "监控系统资源使用情况",
    type: "local",
    usage: "用于查看系统状态"
  }
];

// 工具类型配置
const toolTypesConfig = [
  { type: "function", label: "函数工具", description: "可直接调用的函数工具" },
  { type: "api", label: "API工具", description: "通过API调用的外部工具" },
  { type: "local", label: "本地工具", description: "本地环境可用的工具" }
];

const Tools: React.FC = () => {
  useEffect(() => {
    // 可以在这里添加数据获取逻辑
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">工具中心</h1>

      {toolTypesConfig.map((config) => {
        // 获取当前类型的工具
        const tools = toolsData.filter(tool => tool.type === config.type);

        return (
          <div key={config.type} className="mb-12">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">{config.label}</h2>
              <p className="text-muted-foreground">{config.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tool.usage && <p className="text-sm text-muted-foreground">{tool.usage}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">使用工具</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Tools;
