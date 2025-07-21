import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import styles from './CreatorMainPage.module.css';
import { UserInfo } from '../../../components/MainPage/UserInfo/UserInfo';
import { ContentCardList } from '../../../components/ContentCard/ContentCardList';
import { SubscriptionModal } from '../../../components/ManageSubscriptionPage/SubscriptionModal/SubscriptionModal';

export const CreatorMainPage = () => {
  const { creatorNickname } = useParams(); // URL에서 닉네임 추출
  const [creator, setCreator] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('accessToken');
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    console.log('닉네임:', creatorNickname);
    if (!creatorNickname) return;

    // 1. 크리에이터 정보 불러오기
    axios
      .get(`/api/user/public/${encodeURIComponent(creatorNickname)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        const data = res.data;
        setCreator(data);
        console.log('사용자 정보 응답:', data);

        // 2. 해당 크리에이터의 콘텐츠 목록 불러오기
        return axios.get(`/api/content/creator/${data.userId}`);
      })
      .then(res => {
        console.log('콘텐츠 목록 응답:', res.data);
        setContents(res.data);
      })
      .catch(err => {
        console.error('크리에이터 정보 또는 콘텐츠 불러오기 실패', err);
      })
      .finally(() => setLoading(false));
  }, [creatorNickname]);

  if (loading) return <div>로딩 중...</div>;
  if (!creator) return <div>크리에이터를 찾을 수 없습니다.</div>;

  return (
    <div className={styles.userMainPage}>
      <UserInfo
        user={{
          role: creator.role,
          profileImage: creator.profileImageUrl,
          nickname: creator.nickname,
          bio: creator.bio,
          job: creator.jobName,
          subscriberCount: creator.subsCount ?? 0,
          isSubscribed: creator.subscribed ?? false,
        }}
        onUnsubscribeClick={() => setModalType('cancel')} // 구독중일 때만 호출됨
      />
      <div className={styles.content}>
        <h1 className={styles.title}>콘텐츠 목록</h1>
        <ContentCardList contents={contents} />
      </div>

      {modalType && (
        <SubscriptionModal
          type={modalType}
          onClose={() => setModalType(null)}
          onConfirm={() => {
            if (modalType === 'resume') {
              window.location.href = `/payments/summary?creatorNickname=${creator.nickname}`;
            } else {
              axios
                .delete(`/api/subscriptions/${creator.userId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then(() => {
                  setCreator(prev => ({ ...prev, isSubscribed: false }));
                })
                .finally(() => setModalType(null));
            }
          }}
        />
      )}
    </div>
  );
};
