import React, { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
import styles from './dashboard.module.scss';
import LLMConfig from '@/pages/LLMConfig/LLMConfig';
import { Bot } from 'lucide-react';
import Chat from '@/pages/chat/Chat';

const Dashboard: React.FC = () => {
  // const { user, logout } = useAuth();
  const [showChat, setShowChat] = useState(false);

  const ShowBot = () => {
    console.log('ShowBot');
    setShowChat(prev => !prev);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.operatorCard}>
        <Bot onClick={ShowBot} className="cursor-pointer" />
      </div>
      <div className={styles.mainPage}>
        <div className={styles.mainHeader}>
          <LLMConfig />
        </div>
        <div className={styles.mainContent}>
          {showChat && <Chat />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
