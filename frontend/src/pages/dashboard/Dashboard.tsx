import React from 'react';
// import { useAuth } from '../../hooks/useAuth';
import styles from './dashboard.module.scss';
import LLMConfig from '@/pages/LLMConfig/LLMConfig';
import { Bot } from 'lucide-react';
import Chat from '@/pages/chat/Chat';

const Dashboard: React.FC = () => {
  // const { user, logout } = useAuth();

  const ShowBot = () => {
    console.log('ShowBot');
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
          <Chat />



        </div>
      </div>
    </div>
  );
};

export default Dashboard;
