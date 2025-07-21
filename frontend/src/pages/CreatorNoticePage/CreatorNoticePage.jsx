import React from 'react';
import { UserInfo } from '../../components/MainPage/UserInfo/UserInfo';
import styles from './CreatorNoticePage.module.css';
import NoticeBox from '../../components/CreatorNoticePage/NoticeBox';

function CreatorNoticePage() {
  // 크리에이터 정보
  const user = {
    role: '역할',
    profileImage: 'https://c.animaapp.com/md5nv2zm9suaL3/img/profileimage.png',
    nickname: '개발퀸',
    bio: '클린 코드와 테스트 주도 개발을 사랑하는 개발자. 실무에서 바로 쓸 수 있는 팁을 전합니다',
    subscriberCount: 121,
    isSubscribed: false,
  };

  const { profileImage, nickname, bio, role, subscriberCount, isSubscribed } = user;

  return (
    <div className={styles.notice_page}>
      {/* 크리에이터 섹션*/}

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
          </>
        )}
        <div className={styles.subscriberCount}>구독자 수 {subscriberCount}명</div>
        {/* bio */}
        <p className={styles.bio}>{bio}</p>

        {/* 크리에이터일 경우 버튼 */}
        {role === 'CREATOR' && (
          <div className={styles.buttonGroup}>
            <button className={styles.write_button}>작성하기</button>
          </div>
        )}
        <div className={styles.buttonGroup}>
          <button className={styles.write_button}>작성하기</button>
        </div>
      </div>

      {/*notice section*/}
      <div className={styles.separator}></div>

      <div className={styles.notice_container}>
        <NoticeBox
          date="2025-07-15"
          profileImage="https://c.animaapp.com/md45uvjzPxvxqT/img/profilebutton-1.png"
          content={`Artificial Intelligence (AI) offers numerous advantages and has the potential to revolutionize
various aspects of our lives. Here are some key advantages of AI:

Automation: AI can automate repetitive and mundane tasks, saving time and effort for humans...
(생략)`}
          time="16:46"
        />
        <NoticeBox
          date="2025-07-15"
          profileImage="https://c.animaapp.com/md45uvjzPxvxqT/img/profilebutton-1.png"
          content={`Artificial Intelligence (AI) offers numerous advantages and has the potential to revolutionize
various aspects of our lives. Here are some key advantages of AI:

Automation: AI can automate repetitive and mundane tasks, saving time and effort for humans...
(생략)`}
          time="16:46"
        />
        <NoticeBox
          date="2025-07-15"
          profileImage="https://c.animaapp.com/md45uvjzPxvxqT/img/profilebutton-1.png"
          content={`Artificial Intelligence (AI) offers numerous advantages and has the potential to revolutionize
various aspects of our lives. Here are some key advantages of AI:

Automation: AI can automate repetitive and mundane tasks, saving time and effort for humans...
(생략)`}
          time="16:46"
        />
      </div>
    </div>
  );
}

export default CreatorNoticePage;
