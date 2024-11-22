import React, { useEffect } from 'react';
import styles from './AchievementNotification.module.css';

function AchievementNotification({ achievementName}) {
  return (
    <div className={styles.notification}>
      <div className={styles.content}>
        <h3>Achievement Unlocked!</h3>
        <p>{achievementName}</p>
      </div>
    </div>
  );
}

export default AchievementNotification;
