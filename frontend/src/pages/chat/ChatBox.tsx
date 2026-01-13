import React, { useState, useCallback } from 'react';
import { Chat, Radio, RadioGroup } from '@douyinfe/semi-ui';

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
  // borderRadius: '16px',
  // margin: '8px 16px',
  width: '100%',
  height: '100%',
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

  const onAlignChange = useCallback((e) => {
    setAlign(e.target.value);
  }, []);

  const onModeChange = useCallback((e) => {
    setMode(e.target.value);
  }, []);

  const onMessageSend = useCallback((content, attachment) => {
    const newAssistantMessage = {
      role: 'assistant',
      id: getId(),
      createAt: Date.now(),
      content: '这是一条 mock 回复信息',
    };
    setTimeout(() => {
      setMessage((message) => [...message, newAssistantMessage]);
    }, 200);
  }, []);

  const onChatsChange = useCallback((chats) => {
    setMessage(chats);
  }, []);

  const onMessageReset = useCallback((e) => {
    setTimeout(() => {
      setMessage((message) => {
        const lastMessage = message[message.length - 1];
        const newLastMessage = {
          ...lastMessage,
          status: 'complete',
          content: 'This is a mock reset message.',
        };
        return [...message.slice(0, -1), newLastMessage];
      });
    }, 200);
  });

  return (
    <>
      <Chat
        key={align + mode}
        align={align}
        mode={mode}
        uploadProps={uploadProps}
        style={commonOuterStyle}
        chats={message}
        roleConfig={roleInfo}
        onChatsChange={onChatsChange}
        onMessageSend={onMessageSend}
        onMessageReset={onMessageReset}
        uploadTipProps={uploadTipProps}
      />
    </>
  );
};

export default ChatBox;
