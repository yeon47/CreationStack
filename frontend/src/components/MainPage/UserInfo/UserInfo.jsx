import React from 'react';
import styles from './UserInfo.module.css';
import CreatorIcon from '../../../../public/creator-icon.svg';

// 사용자 메인페이지에서 사용자 정보
// 대상 페이지의 사용자가 크리에이터인지에따라 다르게 생성(로그인한 사용자 기준 아님)
export const UserInfo = ({ user }) => {
  const { profileImage, nickname, bio, role, job, subscriberCount, isSubscribed } = user;

  return (
    <div className={styles.container}>
      {/* 프로필 이미지 */}
      <img src={profileImage} alt={`${nickname} 프로필`} className={styles.profileImage} />
      
      {/* 닉네임 */}
      <div className={styles.nicknameWrapper}>
        <span className={styles.nickname}>{nickname}</span>
        {role === 'CREATOR' && <img src={CreatorIcon} alt="크리에이터 뱃지" className={styles.creatorBadge} />}
      </div>

      {/* 크리에이터일 경우 구독자 수 / 직업 표시 */}
      {role === 'CREATOR' && (
        <>
          <div className={styles.subscriberCount}>구독자 수 {subscriberCount}명</div>
          <div className={styles.job}>{job}</div>
        </>
      )}

      {/* bio */}
      <p className={styles.bio}>{bio}</p>

      {/* 크리에이터일 경우 버튼 */}
      {role === 'CREATOR' && (
        <div className={styles.buttonGroup}>
          <button className={styles.noticeButton}>공지방</button>
          <button className={styles.subscribeButton}>{isSubscribed ? '구독중' : '구독하기'}</button>
        </div>
      )}

      <hr className={styles.divider} />
    </div>
  );
};
