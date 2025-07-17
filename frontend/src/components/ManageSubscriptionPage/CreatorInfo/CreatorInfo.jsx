import React, { useState } from 'react';
import styles from './CreatorInfo.module.css';

import { StatusButton } from '../StatusButton/StatusButton';
import { SubscriptionModal } from '../SubscriptionModal/SubscriptionModal';

export const CreatorInfo = ({ className, profileImage, creatorName, subsCount, bio, userStatus, date }) => {
  // 상태별 메시지 + 버튼 정의
  const statusConfig = {
    SUBSCRIBED: {
      message: `다음 결제 예정일: ${date}`,
    },
    CANCELLED: {
      message: `만료 예정일: ${date}`,
    },
    FAILED: {
      message: '결제가 실패하여, 자동 구독 해지되었습니다.',
    },
  };

  const status = statusConfig[userStatus] || {};
  const [modalType, setModalType] = useState(null);

  const handleStatusClick = () => {
    if (userStatus === 'SUBSCRIBED') setModalType('cancel');
    else if (userStatus === 'CANCELLED' || userStatus === 'FAILED') setModalType('resume');
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleConfirmModal = () => {
    // 실제 해지/재구독 처리 로직 추가 예정
    console.log(`${modalType} confirmed`);
    setModalType(null);
  };

  return (
    <>
      <div className={styles['creatorInfo']}>
        <div className={`${styles['profile-image-wrapper']} ${className}`}>
          <img src={profileImage} alt="프로필" className={styles['profile-image']} />
        </div>

        <div className={styles['group']}>
          <div className={styles['creator-name']}>{creatorName}</div>
          <div className={styles['subscriber-count']}>구독자 수 : {subsCount} 명</div>
          <p className={styles['p']}>{bio}</p>
          <div className={styles['status-message']}>{status.message}</div>
        </div>

        <div className={styles['button-area']}>
          <StatusButton status={userStatus} className={styles['button']} onClick={handleStatusClick} />
        </div>
      </div>

      {modalType && <SubscriptionModal type={modalType} onClose={handleCloseModal} onConfirm={handleConfirmModal} />}
    </>
  );
};
