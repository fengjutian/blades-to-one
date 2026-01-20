import styles from "./monitor.module.css";
import React from "react";
const Monitor: React.FC = () => {
  return (
    <div className={styles["monitor-wrap"]}>
      <h1 className="text-3xl font-bold mb-8">监控中心</h1>
    </div>
  );
};

export default Monitor;
