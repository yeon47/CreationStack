import React from 'react';
import styles from './StatusButton.module.css';

// 사용자 구독 목록 조회에서 구독 상태 버튼
export const StatusButton = ({ status = 'SUBSCRIBED', className, onClick }) => {
  const config = {
    SUBSCRIBED: {
      label: '구독 중',
    },
    CANCELLED: {
      label: '구독 해지됨',
    },
    FAILED: {
      label: '결제 실패',
    },
  };

  const { label, color } = config[status] || config.SUBSCRIBED;

  return (
    <div
      className={`${styles['status-button']} ${styles[status.toLowerCase()]} ${className}`}
      style={{
        backgroundColor: color,
        cursor: 'pointer',
      }}
      onClick={onClick}
      >
      <div className={styles['label']}>{label}</div>
    </div>
  );
};
