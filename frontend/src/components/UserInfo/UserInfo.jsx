import React from 'react';
import styles from './UserInfo.module.css';

// 사용자 메인페이지에서 사용자 정보
export const UserInfo = ({ user }) => {
  const { profileImage, nickname, bio } = user;

  return (
    <div className={styles.container}>
      <img src={profileImage} alt={`${nickname} 프로필`} className={styles.profileImage} />
      <div className={styles.nickname}>{nickname}</div>
      <p className={styles.bio}>{bio}</p>
      <hr className={styles.divider} />
    </div>
  );
};
