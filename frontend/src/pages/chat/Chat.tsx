import React from 'react';
import styles from './chat.module.scss';

const Chat: React.FC = () => {
  return (
    <div className={styles.chat}>
      <div className={styles.chatHeader}>chat</div>
      <div className={styles.chatContent}></div>
    </div>
  );
};

export default Chat;
