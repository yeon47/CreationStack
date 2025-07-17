import React from 'react';
import styles from './CreatorCard.module.css';

const CreatorCard = ({ creator }) => (
  <div className={styles.creatorCard}>
    <div className={styles.profileImage} style={{ backgroundImage: `url(${creator.profileImageUrl})` }} />
    <div className={styles.textSection}>
      <div className={styles.name}>{creator.name}</div>
      <div className={styles.job}>{creator.job}</div>
      <div className={styles.subscriberCount}>구독자 수 {creator.subscriberCount}명</div>
      <p className={styles.description}>{creator.description}</p>
    </div>
  </div>
);

export default CreatorCard;
