import React, { useEffect, useState } from 'react';
import styles from './paymentMethodManagementPage.module.css';
import PaymentMethodList from '../../components/Payment/PaymentMethodList';
import WarningModal from '../../components/Payment/WarningModal';
import {
  requestIssueBillingKey,
  savePaymentMethod,
  readAllPaymentMethod,
  deletePaymentMethod,
} from '../../api/payment';

function PaymentMethodManagementPage() {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('confirm-delete'); // 'confirm-delete', 'delete-success', 'delete-fail'
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const storeId = import.meta.env.VITE_STORE_ID;
  const channelKey = import.meta.env.VITE_CHANNEL_KEY;

  // 컴포넌트가 마운트될 때 카드 정보 불러오기
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await readAllPaymentMethod(); // API 호출

        // 샘플 데이터 삭제 예정
        const testCards = [
          {
            cardName: '국민카드',
            cardNumber: '11111111****111*',
            cardType: '신용카드',
            cardBrand: 'VISA',
          },
          {
            cardName: '토스뱅크',
            cardNumber: '11111111****111*',
            cardType: '신용카드',
            cardBrand: 'VISA',
          },
          {
            cardName: '농협카드',
            cardNumber: '11111111****111*',
            cardType: '신용카드',
            cardBrand: 'MASTER',
          },
          {
            cardName: '비씨카드',
            cardNumber: '11111111****111*',
            cardType: '신용카드',
            cardBrand: 'MASTER',
          },
        ];

        // 실제 카드 + 테스트 카드 결합
        setCards([...res, ...testCards]);
      } catch (err) {
        console.error('카드 정보를 불러오는 데 실패했습니다.', err);
      }
    };
    fetchCards();
  }, []); // 빈 배열 → 최초 한 번만 실행됨

  // 결제수단 삭제 여부 팝업
  const handleCardDeleteClick = card => {
    setSelectedCard(card);
    setModalType('confirm-delete');
    setIsModalOpen(true);
  };

  // 팝업 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setModalType(''); // 혹은 null, '' 등 초기 상태로 변경
  };

  // 결제수단 삭제 확인 후 삭제진행 + 완료/실패 팝업
  const handleDeleteConfirm = async card => {
    // 기존 모달 닫기
    setIsModalVisible(false);
    const reason = card.cardName + '을 삭제합니다.';

    // 300ms 후 새 모달 보여주기 (애니메이션 타이밍)
    setTimeout(async () => {
      try {
        const response = await deletePaymentMethod(card.paymentMethodId, reason);

        if (card.paymentMethodId === response.paymentMethodId) {
          setCards(prev => prev.filter(c => c.paymentMethodId !== card.paymentMethodId));
          setModalType('delete-success');
        }
      } catch (error) {
        setModalType('delete-fail');
      }
      setIsModalVisible(true);
    }, 300); // CSS 애니메이션과 맞춤
  };

  //빌링키 발급 후 결제수단 조회해 보여주는 메소드
  const handleCardRegister = async () => {
    // 빌링키 발급 (로그인한 사용자로 test, test@gmail.com 부분 바꿀 예정)
    const issueResponse = await requestIssueBillingKey(storeId, channelKey, 'test', 'test@gmail.com');
    // 발급된 빌링키 이용한 결제수단 조회 (빌링키 발급단계에서 이루어진 결제수단 조회)
    const saveResponse = await savePaymentMethod(issueResponse.billingKey);

    // 회원이 추가한 결제수단을 cards에 저장
    const { username, ...cardWithoutUsername } = saveResponse;

    setCards(prev => [...prev, cardWithoutUsername]);
  };

  //  const handleCardRegister = async () => {
  //     const issueResponse = await requestIssueBillingKey(storeId, channelKey, 'test', 'test@gmail.com');
  //     const saveResponse = await savePaymentMethod(issueResponse.billingKey);
  //     const { username, ...cardWithoutUsername } = saveResponse;
  //     setCards(prev => [...prev, cardWithoutUsername]);
  //   };

  return (
    <div className={styles.payment_container}>
      {/* 결제수단관리 헤더 */}
      <div className={styles.header}>
        <p className={styles.title}>결제수단 관리</p>
        <p className={styles.sub_title}>등록된 결제수단을 관리하고 새로운 결제수단을 추가할 수 있습니다</p>
      </div>

      {/* 등록된 카드 리스트 */}
      <PaymentMethodList cards={cards} onDeleteCard={handleCardDeleteClick} />

      {/* 카드 등록 버튼 */}
      <div className={styles.register}>
        <button className={styles.register_button} onClick={handleCardRegister}>
          <p>카드 등록</p>
        </button>
      </div>

      {/* 결제수단 삭제 관련 모달창 */}
      <WarningModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type={modalType}
        isVisible={isModalVisible} // 추가
        cardData={selectedCard}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default PaymentMethodManagementPage;
