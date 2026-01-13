import React, { ReactElement, useState } from 'react';
import styles from './chat.module.scss';
import { SquarePen, Image } from 'lucide-react';
// import { Chat as SemiChat } from '@douyinfe/semi-ui';
import ChatBox from './ChatBox';

const Chat: React.FC = () => {
  const [siderBarList, setSiderBarList] = useState<
    { icon: ReactElement<any, any>; name: string; isActivity: boolean }[]
  >([
    {
      icon: <SquarePen size={18} />,
      name: '新聊天',
      isActivity: true,
    },
    {
      icon: <Image size={18} />,
      name: '图片',
      isActivity: false,
    },
  ]);

  const selectedComponent = (componentName: string) => {
    setSiderBarList((prevList) =>
      prevList.map((item) => ({
        ...item,
        isActivity: item.name === componentName,
      }))
    );
  };

  return (
    <div className={styles.chatCtx}>
      <div className={styles.sidebar}>
        {siderBarList.map((item) => (
          <div
            key={item.name}
            onClick={() => selectedComponent(item.name)}
            className={`${styles.siderBarItem} ${item.isActivity ? styles.activity : ''}`}
          >
            {item.icon}
            <div className={styles.siderBarItemName}>{item.name}</div>
          </div>
        ))}
      </div>
      <div className={styles.chat}>
        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
