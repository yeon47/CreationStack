import React from "react";
import styles from "./SubscriptionModal.module.css";

export const SubscriptionModal = ({ type, onClose, onConfirm }) => {
  const config = {
    cancel: {
      title: "정기 구독을 해지하시겠습니까?",
      description: "해지 시 다음 결제일부터 구독이 종료되며,\n서비스 이용이 제한됩니다.",
      confirmText: "해지하기",
    },
    resume: {
      title: "구독을 다시 시작하시겠습니까?",
      description: "즉시 결제가 진행되며,\n구독이 다시 활성화됩니다.",
      confirmText: "구독 시작",
    },
  };

  const { title, description, confirmText } = config[type];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          <button className={styles.confirmBtn} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};