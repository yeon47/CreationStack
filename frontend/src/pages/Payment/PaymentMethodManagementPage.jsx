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
        const testCards = [
        {
          cardName: '테스트카드 1',
          cardNumberMasked: '1111-****-****-1111',
          cardType: '신용카드',
          customerKey: 'dummy-key-1',
          billingKey: 'dummy-billing-key-1',
        },
        {
          cardName: '테스트카드 2',
          cardNumberMasked: '2222-****-****-2222',
          cardType: '체크카드',
          customerKey: 'dummy-key-2',
          billingKey: 'dummy-billing-key-2',
        },
        {
          cardName: '테스트카드 3',
          cardNumberMasked: '3333-****-****-3333',
          cardType: '신용카드',
          customerKey: 'dummy-key-3',
          billingKey: 'dummy-billing-key-3',
        },
        {
          cardName: '테스트카드 4',
          cardNumberMasked: '4444-****-****-4444',
          cardType: '체크카드',
          customerKey: 'dummy-key-4',
          billingKey: 'dummy-billing-key-4',
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
          <p>결제</p>
        </button>
      </div>
    </div>
  );
}

export default PaymentMethodManagementPage;
