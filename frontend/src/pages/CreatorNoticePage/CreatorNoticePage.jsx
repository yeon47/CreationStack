import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CreatorNoticePage.module.css';
import NoticeBox from '../../components/CreatorNoticePage/NoticeBox';
import { getNotices, getReactions, saveNotice, updateNotice, deleteNotice } from '../../api/notice';
import { getPublicCreatorProfile } from '../../api/profile';
import { getMySubscriptions } from '../../api/subscription';
function CreatorNoticePage() {
  const { creatorNickname } = useParams();
  const [notices, setNotices] = useState([]);

  const [creator, setCreator] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const noticeListRes = await getNotices(1);
      const noticeList = noticeListRes.data;

      const noticesWithReactions = await Promise.all(
        noticeList.map(async notice => {
          const reactionRes = await getReactions(notice.noticeId);
          return {
            ...notice,
            reactions: reactionRes.data,
          };
        })
      );
      console.log(noticesWithReactions);

      setNotices(noticesWithReactions);
    } catch (error) {
      console.error('공지 및 리액션 불러오기 실패:', error);
    }
  };

  // // 작성
  // const handleCreate = async () => {
  //   try {
  //     await saveNotice(creatorId, newNotice);
  //     alert('공지 작성 완료');
  //     setIsWriting(false);
  //     setNewNotice({ title: '', content: '', thumbnailUrl: '' });
  //     fetchNotices();
  //   } catch (err) {
  //     console.error('작성 실패', err);
  //   }
  // };

  // // 수정
  // const handleUpdate = async (noticeId, updatedNotice) => {
  //   try {
  //     await updateNotice(creatorId, noticeId, updatedNotice);
  //     alert('수정 완료');
  //     fetchNotices();
  //   } catch (err) {
  //     console.error('수정 실패', err);
  //   }
  // };

  // // 삭제
  // const handleDelete = async noticeId => {
  //   try {
  //     await deleteNotice(creatorId, noticeId);
  //     alert('삭제 완료');
  //     fetchNotices();
  //   } catch (err) {
  //     console.error('삭제 실패', err);
  //   }
  // };

  // 크리에이터 정보
  const user = {
    role: '',
    profileImage: 'https://c.animaapp.com/md5nv2zm9suaL3/img/profileimage.png',
    nickname: '',
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
          {creator && <span className={styles.nickname}>{creator.nickname}</span>}{' '}
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
        {notices.map(notice => {
          const createdAt = new Date(notice.createdAt);
          const date = createdAt.toISOString().split('T')[0];
          const time = createdAt.toTimeString().substring(0, 5);

          return <NoticeBox notice={notice} />;
        })}
      </div>
    </div>
  );
}

export default CreatorNoticePage;
