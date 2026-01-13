import React from 'react';
import styles from './chat.module.scss';
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "./AppSidebar";
import { SquarePen, Image  } from 'lucide-react';


const siderBarList = [
  {
    icon: <SquarePen size={18} />,
    name: '新聊天',
    isActivity: true
  },
  {
    icon: <Image size={18} />,
    name: '图片',
    isActivity: false
  }
]

const Chat: React.FC = () => {


  return (
    <div className={styles.chatCtx}>
      <div className={styles.sidebar}>
        {
          siderBarList.map((item) => (
            <div key={item.name} onClic className={`${styles.siderBarItem} ${item.isActivity ? styles.activity : ''}`}>
              {item.icon}
              <div className={styles.siderBarItemName}>{item.name}</div>
            </div>
          ))
        }
      </div>
      <div className={styles.chat}></div>
    </div>
  );
};

export default Chat;
