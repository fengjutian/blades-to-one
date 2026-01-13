import React, { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
import styles from './dashboard.module.scss';
import LLMConfig from '@/pages/LLMConfig/LLMConfig';
import { Bot, Workflow  } from 'lucide-react';
import Chat from '@/pages/chat/Chat';
import WorkflowEle from '@/pages/workflow/Workflow';

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
        <Workflow onClick={ShowBot} className="cursor-pointer" />
      </div>
      <div className={styles.mainPage}>
        <div className={styles.mainHeader}>
          <LLMConfig />
        </div>
        <div className={styles.mainContent}>
          {showChat && <Chat />}
          <WorkflowEle />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
