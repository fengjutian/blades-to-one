import React, { ReactElement, useState } from 'react';
import styles from './chat.module.scss';
import { SquarePen, Image } from 'lucide-react';
import ChatBox from './ChatBox';
import ImageChat from './ImageChat';

const Chat: React.FC = () => {
  const [selectedComponentName, setSelectedComponentName] = useState<string>('新聊天');

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

    setSelectedComponentName(componentName);
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
        {selectedComponentName === '新聊天' && <ChatBox />}
        {selectedComponentName === '图片' && <ImageChat />}
      </div>
    </div>
  );
};

export default Chat;

