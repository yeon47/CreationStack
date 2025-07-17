import React, { useEffect, useState } from 'react';
import styles from './paymentMethodManagementPage.module.css';
import PaymentMethodList from '../../components/Payment/PaymentMethodList';
import { requestIssueBillingKey, savePaymentMethod, readAllPaymentMethod } from '../../api/portone';

// paymentMethodManagement page
function PaymentMethodManagementPage() {
  const [cards, setCards] = useState([]);
  const storeId = import.meta.env.VITE_STORE_ID;
  const channelKey = import.meta.env.VITE_CHANNEL_KEY;

  // 컴포넌트가 마운트될 때 카드 정보 불러오기
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await readAllPaymentMethod(); // API 호출
        setCards(res); // 받아온 카드 정보를 상태에 저장
      } catch (err) {
        console.error('카드 정보를 불러오는 데 실패했습니다.', err);
      }
    };
    fetchCards();
  }, []); // 빈 배열 → 최초 한 번만 실행됨

  //빌링키 발급 후 결제수단 조회해 보여주는 메소드
  const handleCardRegister = async () => {
    // 빌링키 발급
    const issueResponse = await requestIssueBillingKey(storeId, channelKey, 'test', 'test@gmail.com');
    // 발급된 빌링키 이용한 결제수단 조회
    const saveResponse = await savePaymentMethod(issueResponse.billingKey);

    const { username, ...cardWithoutUsername } = saveResponse;

    setCards(prev => [...prev, cardWithoutUsername]);
  };

  return (
    <div className={styles.payment_container}>
      {/* 결제수단관리 헤더 */}
      <div className={styles.header}>
        <p className={styles.title}>결제수단 관리</p>
        <p className={styles.sub_title}>등록된 결제수단을 관리하고 새로운 결제수단을 추가할 수 있습니다</p>
      </div>

      {/* 등록된 카드 리스트 */}
      <PaymentMethodList cards={cards} />
      <div className={styles.register}>
        <button className={styles.register_button} onClick={handleCardRegister}>
          <p>카드 등록</p>
        </button>
      </div>
    </div>
  );
}

export default PaymentMethodManagementPage;
