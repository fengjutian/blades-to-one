import React from 'react';
import styles from './chat.module.scss';

const Chat: React.FC = () => {
  return (
    <div className={styles.chat}>
      <div className={styles.chatHeader}></div>
      <div className={styles.chatContent}></div>
    </div>
  );
};

export default Chat;
