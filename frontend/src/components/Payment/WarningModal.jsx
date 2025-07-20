import React from 'react';
import styles from './WarningModal.module.css';

const WarningModal = ({ isOpen, onClose, isVisible = true, cardData, type, onConfirm }) => {
  if (!isOpen) return null;

  let title = '';
  let message = '';
  let confirmText = '확인';
  let showCancel = false;
  let showConfirm = true;

  switch (type) {
    case 'confirm-delete':
      title = '정말로 결제수단을 삭제하시겠습니까?';
      message = (
        <>
          이 결제수단을 삭제하면 더 이상 해당 카드로 결제하실 수 없습니다.
          <br />
          정말로 삭제하시겠습니까?
        </>
      );
      confirmText = '삭제';
      showCancel = true;
      break;
    case 'delete-success':
      title = '삭제가 완료되었습니다.';
      message = '선택하신 결제수단이 정상적으로 삭제되었습니다.';
      showCancel = false;
      break;
    case 'delete-fail':
      title = '결제수단을 삭제할 수 없습니다.';
      message = (
        <>
          해당 결제수단은 현재 구독 결제에 사용중이어서 삭제할 수 없습니다.
          <br />
          구독을 해지하거나 다른 결제수단으로 변경한 후 삭제해 주세요.
        </>
      );
      showCancel = false;
      break;
    case 'method-fail':
      title = '결제수단이 등록되지 않았습니다.';
      message = (
        <>
          구독을 진행하려면 결제수단을 등록해야 합니다. <br />
          결제수단을 등록해주세요.
        </>
      );
      showCancel = false;
      break;
    default:
      break;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.warning_popup} ${isVisible ? styles.fadeIn : styles.fadeOut}`}>
        <div className={styles.modal}>
          <div className={styles.popupHeader}>
            <h2 className={styles.titleText}>{title}</h2>
            <span className={styles.cancelButton} onClick={onClose}>
              ×
            </span>
          </div>
          <p className={styles.subText}>{message}</p>
          <div className={styles.separator} />
          <div className={styles.bottomButton}>
            {showCancel && (
              <button className={`${styles.button} ${styles.cancel}`} onClick={onClose}>
                취소
              </button>
            )}
            {showConfirm && (
              <button
                className={styles.button}
                onClick={() => {
                  if (type === 'confirm-delete') onConfirm(cardData); // 삭제 시 삭제할 카드 데이터 전달
                  else onClose();
                }}>
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
