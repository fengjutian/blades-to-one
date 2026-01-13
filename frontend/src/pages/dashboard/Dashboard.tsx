import React from 'react';
// import { useAuth } from '../../hooks/useAuth';
import styles from './dashboard.module.scss';
import LLMConfig from '@/pages/LLMConfig/LLMConfig';
import { Bot } from 'lucide-react';

const Dashboard: React.FC = () => {
  // const { user, logout } = useAuth();

  return (
    <div className={styles.dashboard}>
      <div className={styles.operatorCard}>
        <Bot />
      </div>
      <div className={styles.mainPage}>
        <div className={styles.mainHeader}>

          <LLMConfig />
        </div>
        <div className={styles.mainContent}>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;
