import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './dashboard.module.scss';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.dashboard}>
      <div className={styles.operatorCard}></div>
      <div className={styles.mainPage}></div>
    </div>
  );
};

export default Dashboard;
