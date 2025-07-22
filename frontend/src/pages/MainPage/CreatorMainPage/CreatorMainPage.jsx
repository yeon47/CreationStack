import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './CreatorMainPage.module.css';
import { UserInfo } from '../../../components/MainPage/UserInfo/UserInfo';
import { ContentCardList } from '../../../components/ContentCard/ContentCardList';
import { SubscriptionModal } from '../../../components/ManageSubscriptionPage/SubscriptionModal/SubscriptionModal';
import { getPublicUserProfile } from '../../../api/profile';
import { getContentsByCreator } from '../../../api/contentAPI';
import { cancelSubscription, getMySubscriptions } from '../../../api/subscription';

export const CreatorMainPage = () => {
  const { creatorNickname } = useParams(); // URL에서 닉네임 추출
  const [creator, setCreator] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    if (!creatorNickname) return;

    const fetchCreatorData = async () => {
      try {
        const creatorData = await getPublicUserProfile(creatorNickname);

        if (creatorData.subscribed) {
          const subscriptions = await getMySubscriptions();
          const subscription = subscriptions.find(sub => sub.creatorId === creatorData.userId);
          if (subscription) {
            creatorData.subscriptionId = subscription.subscriptionId;
          }
        }

        setCreator(creatorData);
        const contentsData = await getContentsByCreator(creatorData.userId);
        setContents(contentsData);
      } catch (error) {
        console.error('크리에이터 정보 또는 콘텐츠 불러오기 실패', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [creatorNickname]);

  const handleSubscriptionChange = async () => {
    if (modalType === 'resume') {
      window.location.href = `/payments/summary/${creator.nickname}`;
    } else {
      try {
        await cancelSubscription(creator.subscriptionId);
        setCreator(prev => ({ ...prev, subscribed: false }));
      } catch (error) {
        console.error('구독 취소 실패', error);
      } finally {
        setModalType(null);
      }
    }
  };

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
          onConfirm={handleSubscriptionChange}
        />
      )}
    </div>
  );
};
