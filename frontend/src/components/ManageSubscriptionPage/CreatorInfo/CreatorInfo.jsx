import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatorInfo.module.css';

import { StatusButton } from '../StatusButton/StatusButton';
import { SubscriptionModal } from '../SubscriptionModal/SubscriptionModal';

// 사용자 구독 목록에서 크리에이터 정보
export const CreatorInfo = ({ className, creatorNickname, profileImage, subsCount, bio, userStatus, date }) => {
  // 상태별 메시지 + 버튼 정의
  const formatDate = isoString => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(
      2,
      '0'
    )}일`;
  };

  const statusConfig = {
    ACTIVE: { message: `다음 결제 예정일: ${formatDate(date)}` },
    CANCELLED: { message: `만료 예정일: ${formatDate(date)}` },
    EXPIRED: { message: '유효기간이 만료되어, 구독 해지되었습니다.' },
  };

  const status = statusConfig[userStatus] || {};
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();

  const handleStatusClick = e => {
    e.stopPropagation(); // 부모 div 클릭 막기
    console.log('버튼 클릭됨');
    if (userStatus === 'ACTIVE') setModalType('cancel');
    else if (userStatus === 'CANCELLED' || userStatus === 'EXPIRED') setModalType('resume');
  };

  const handleClickCreator = () => {
    navigate(`/creator-main/${creatorNickname}`);
  };

  const handleConfirm = async () => {
    if (modalType === 'resume') {
      navigate(`/payments/summary/${creatorNickname}`);
      return;
    }

    // 해지일 경우 처리
    setModalType(null);
  };

  return (
    <>
      <div className={styles['creatorInfo']} onClick={handleClickCreator}>
        <div className={`${styles['profile-image-wrapper']} ${className}`}>
          <img src={profileImage} alt="프로필" className={styles['profile-image']} />
        </div>

        <div className={styles['group']}>
          <div className={styles['creator-name']}>{creatorNickname}</div>
          <div className={styles['subscriber-count']}>구독자 수 : {subsCount} 명</div>
          <p className={styles['p']}>{bio}</p>
          <div className={styles['status-message']}>{status.message}</div>
        </div>

        <div className={styles['button-area']}>
          <StatusButton status={userStatus} className={styles['button']} onClick={handleStatusClick} />
        </div>
      </div>

      {modalType && (
        <SubscriptionModal
          type={modalType}
          onClose={() => setModalType(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};
