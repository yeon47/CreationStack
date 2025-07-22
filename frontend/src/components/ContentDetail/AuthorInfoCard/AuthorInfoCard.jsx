import React from 'react';
import styles from './AuthorInfoCard.module.css';

const AuthorInfoCard = ({ nickname, job, profileImageUrl }) => {
  console.log('[프로필 이미지 URL]', profileImageUrl);
  return (
    <div className={styles.card}>
      <img src={profileImageUrl || '/default-profile.png'} alt="profile" className={styles.profileImage} />
      <div>
        <div className={styles.nickname}>{nickname}</div>
        <div className={styles.job}>{job}</div>
      </div>
    </div>
  );
};

export default AuthorInfoCard;
