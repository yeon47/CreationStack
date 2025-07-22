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
          content={`안녕하세요, 여러분! 앞으로도 더 좋은 콘텐츠를 만들기 위해 꾸준히 노력하고 있습니다. 이번 주부터 새로운 프로젝트가 시작되어, 매주 특별한 이벤트와 콘텐츠가 업로드될 예정이니 많은 관심과 참여 부탁드려요. 여러분의 소중한 의견도 언제든지 환영합니다!`}
          time="16:46"
        />
        <NoticeBox
          date="2025-07-15"
          profileImage="https://c.animaapp.com/md45uvjzPxvxqT/img/profilebutton-1.png"
          content={`항상 저를 응원해 주시는 팬 여러분께 진심으로 감사드립니다. 여러분과의 소통이 가장 큰 힘이 되기에, 공지방을 통해 여러분의 질문이나 건의사항에 최대한 빠르게 답변드릴 수 있도록 노력하겠습니다. 혹시 궁금한 점이나 요청사항이 있다면 주저하지 말고 말씀해 주세요!)`}
          time="16:46"
        />
        <NoticeBox
          date="2025-07-15"
          profileImage="https://c.animaapp.com/md45uvjzPxvxqT/img/profilebutton-1.png"
          content={`여러분 덕분에 지금까지 올 수 있었습니다. 앞으로도 변함없이 좋은 콘텐츠와 즐거운 경험을 선사하기 위해 최선을 다할 것을 약속드립니다. 함께 성장하는 공간이 될 수 있도록 여러분의 지속적인 관심과 사랑 부탁드려요. 감사합니다!`}
          time="16:46"
        />
      </div>
    </div>
  );
}

export default CreatorNoticePage;
