import React, { useState, useCallback } from 'react';
import { Chat } from '@douyinfe/semi-ui';
import styles from './chatBox.module.scss'

const defaultMessage = [
  {
    role: 'system',
    id: '1',
    createAt: 1715676751919,
    content: "Hello, I'm your AI assistant.",
  },
  {
    role: 'user',
    id: '2',
    createAt: 1715676751919,
    content: '给一个 Semi Design 的 Button 组件的使用示例',
  },
  {
    role: 'assistant',
    id: '3',
    createAt: 1715676751919,
    content:
      "以下是一个 Semi 代码的使用示例：\n\`\`\`jsx \nimport React from 'react';\nimport { Button } from '@douyinfe/semi-ui';\n\nconst MyComponent = () => {\n  return (\n    <Button>Click me</Button>\n );\n};\nexport default MyComponent;\n\`\`\`\n",
  },
];

const roleInfo = {
  user: {
    name: 'User',
    avatar:
      'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
  },
  assistant: {
    name: 'Assistant',
    avatar:
      'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
  },
  system: {
    name: 'System',
    avatar:
      'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
  },
};

const commonOuterStyle = {
  border: '1px solid var(--semi-color-border)',
  height: '100%',
  overflowY: 'auto',
};

let id = 0;
function getId() {
  return `id-${id++}`;
}

const uploadProps = { action: 'https://api.semi.design/upload' };
const uploadTipProps = { content: '自定义上传按钮提示信息' };

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState(defaultMessage);
  const [mode, setMode] = useState('bubble');
  const [align, setAlign] = useState('leftRight');

  const onMessageSend = useCallback(async (content: string, attachment: any) => {
    console.log('点击发送', content, attachment);

    // 添加用户消息到聊天记录
    const newUserMessage = {
      role: 'user',
      id: getId(),
      createAt: Date.now(),
      content: content,
    };
    setMessage((message) => [...message, newUserMessage]);

    try {
      // 在发送新请求前，先在聊天记录中添加一个临时的"思考中"消息
      const thinkingMessage = {
        role: 'assistant',
        id: getId(),
        createAt: Date.now(),
        content: '正在思考...',
      };
      setMessage((prevMessage) => [...prevMessage, thinkingMessage]);

      // 调用后端API
      const response = await fetch('/react/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: content,
          userId: 1, // 这里可以根据实际情况获取用户ID
        }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const result = await response.json();

      // 更新聊天记录，替换临时消息为真实响应
      setMessage((prevMessage) => {
        // 移除临时的"思考中"消息
        const updatedMessages = prevMessage.slice(0, -1);
        // 添加新的助手回复
        const newAssistantMessage = {
          role: 'assistant',
          id: getId(),
          createAt: Date.now(),
          content: result.result,
        };
        return [...updatedMessages, newAssistantMessage];
      });
    } catch (error) {
      console.error('调用模型失败:', error);
      // 更新聊天记录，替换临时消息为错误信息
      setMessage((prevMessage) => {
        // 移除临时的"思考中"消息
        const updatedMessages = prevMessage.slice(0, -1);
        // 添加错误消息
        const errorMessage = {
          role: 'assistant',
          id: getId(),
          createAt: Date.now(),
          content: '抱歉，处理请求时发生错误，请稍后重试。',
        };
        return [...updatedMessages, errorMessage];
      });
    }
  }, []);

  const onChatsChange = useCallback((chats: any) => {
    console.log('onChatsChange', chats);
    setMessage(chats);
  }, []);

  const onMessageReset = useCallback(async (e: any) => {
    // 查找最后一条用户消息
    const lastUserMessage = message.slice().reverse().find(msg => msg.role === 'user');

    if (lastUserMessage) {
      try {
        // 在发送新请求前，先在聊天记录中添加一个临时的"思考中"消息
        const thinkingMessage = {
          role: 'assistant',
          id: getId(),
          createAt: Date.now(),
          content: '正在重新请求模型...',
        };
        setMessage((prevMessage) => [...prevMessage, thinkingMessage]);

        // 重新调用后端API
        const response = await fetch('/react/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: lastUserMessage.content,
            userId: 1, // 这里可以根据实际情况获取用户ID
          }),
        });

        if (!response.ok) {
          throw new Error('请求失败');
        }

        const result = await response.json();

        // 更新聊天记录，替换临时消息为真实响应
        setMessage((prevMessage) => {
          // 移除临时的"思考中"消息
          const updatedMessages = prevMessage.slice(0, -1);
          // 添加新的助手回复
          const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: result.result,
          };
          return [...updatedMessages, newAssistantMessage];
        });
      } catch (error) {
        console.error('重新调用模型失败:', error);
        // 更新聊天记录，替换临时消息为错误信息
        setMessage((prevMessage) => {
          // 移除临时的"思考中"消息
          const updatedMessages = prevMessage.slice(0, -1);
          // 添加错误消息
          const errorMessage = {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: '抱歉，重新请求模型时发生错误，请稍后重试。',
          };
          return [...updatedMessages, errorMessage];
        });
      }
    }
  }, [message]);

  return (
    <Chat
        key={align + mode}
        align='leftRight'
        mode='bubble'
        uploadProps={uploadProps}
        style={commonOuterStyle}
        chats={message}
        roleConfig={roleInfo}
        onChatsChange={onChatsChange}
        onMessageSend={onMessageSend}
        onMessageReset={onMessageReset}
        uploadTipProps={uploadTipProps}
        className={styles.chatBoxWrap}
    />
  );
};

export default ChatBox;

