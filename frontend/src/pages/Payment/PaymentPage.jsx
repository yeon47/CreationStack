// PaymentPage.jsx
import React, { useEffect, useState } from 'react';
import SubscriptionDetails from '../../components/Payment/SubscriptionDetails';
import PaymentModal from '../../components/Payment/PaymentModal';
import WarningModal from '../../components/Payment/WarningModal';
import { registerBillingKey, savePaymentMethod, readAllPaymentMethod } from '../../api/payment';
import styles from './PaymentPage.module.css';
// import SubscriptionSummary from "../../components/Payment/SubscriptionSummary";

function PaymentPage() {
  // props 데이터 선언 또는 상태 관리

  //     const [creator, setCreator] = useState(null);
  //     const [subscriptionDetails, setSubscriptionDetails] = useState([]);
  //     const [benefits, setBenefits] = useState([]);

  //     useEffect(() => {
  //         setCreator({
  //   name: "크리에이터 닉네임",
  //   image: "https://c.animaapp.com/md94mkfi7RFWrF/img/creatorimage.png",
  //         })

  //         setSubscriptionDetails([
  //   { label: "구독 상품", value: "프리미엄 멤버십" },
  //   { label: "가격", value: "₩15,000/월", highlight: true },
  //   { label: "부가세", value: "₩0", bold: false },
  //             { label: "총 결제 금액", value: "₩15,000", bold: true },

  //             set([
  //   "독점 콘텐츠 제공",
  //   "광고 제거",
  //   "라이브 방송 참여",
  // ])
  // ])
  //     }, []);

  // 모달 열기/닫기 핸들러
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('method-fail'); // 'confirm-delete', 'delete-success', 'delete-fail'
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [cardData, setCards] = useState([]);

  const openPayModal = () => setIsPayModalOpen(true);
  const closePayModal = () => setIsPayModalOpen(false);

  const openWarningModal = () => setIsWarningModalOpen(true);
  const closeWarningModal = () => setIsWarningModalOpen(false);
  const storeId = import.meta.env.VITE_STORE_ID;
  const channelKey = import.meta.env.VITE_CHANNEL_KEY;
 // 컴포넌트가 마운트될 때 카드 정보 불러오기
   useEffect(() => {
     const fetchCards = async () => {
       try {
         const res = await readAllPaymentMethod(); // API 호출
         console.log(res)
 
         
         // 실제 카드 + 테스트 카드 결합
         setCards(res);

       } catch (err) {
         console.error('카드 정보를 불러오는 데 실패했습니다.', err);
       }
     };
     fetchCards();
   }, []); // 빈 배열 → 최초 한 번만 실행됨
  // 예시용 데이터
  const creator = {
    name: '크리에이터 닉네임',
    image: 'https://c.animaapp.com/md94mkfi7RFWrF/img/creatorimage.png',
  };

  const subscriptionDetails = [
    { label: '구독 상품', value: '프리미엄 멤버십' },
    { label: '가격', value: '₩15,000/월', highlight: true },
    { label: '부가세', value: '₩0', bold: false },
    { label: '총 결제 금액', value: '₩15,000', bold: true },
  ];

  const benefits = ['독점 콘텐츠 제공', '광고 제거', '라이브 방송 참여'];

  // 결제 진행 버튼 클릭
  const handlePayClick = () => {
    if (cardData.length === 0) {
      // 카드가 없으면 경고 모달 띄움
      setIsWarningModalOpen(true);
    } else {
      // 카드 있으면 결제 모달 열기
      setIsPayModalOpen(true);
    }
  };

  // 결제수단 등록
  const handleCardRegister = async () => {
    try {
      const issueResponse = await requestIssueBillingKey(storeId, channelKey, 'test', 'test@gmail.com');
      const saveResponse = await savePaymentMethod(issueResponse.billingKey);

      // 카드 객체에서 username 제외
      const { username, ...cardWithoutUsername } = saveResponse;

      // 카드 리스트에 추가
      cardData.push(cardWithoutUsername); // 또는 상태로 카드 관리하고 있다면 setCards([...cards, cardWithoutUsername]);

      // 모달 상태 전환
      setModalType('register-success');
      setIsWarningModalOpen(true);
    } catch (error) {
      setModalType('register-fail');
      setIsWarningModalOpen(true);
    }
  };

  return (
    <div className={styles.summary_container}>
      <div className={styles.card}>
        <div className={styles.card_content}>
          {/* Header */}
          <div className={styles.summary_header}>
            <h1 className={styles.summary_title}>결제 요약</h1>
            <p className={styles.summary_subtitle}>구독 정보를 확인하고 결제를 진행하세요</p>
          </div>

          {/* Creator Information */}
          <div className={styles.creator_info}>
            <img className={styles.creator_image} src={creator.image} alt="Creator" />
            <div className={styles.creator_detail}>
              <p className={styles.creator_name}>{creator.name}</p>
              <p className={styles.creator_role}>크리에이터</p>
            </div>
          </div>

          <SubscriptionDetails subscriptionDetails={subscriptionDetails} benefits={benefits} />

          {/* Payment Alert */}
          <div className={styles.alert}>
            <span className={styles.alert_icon}>⚠️</span>
            <div>
              <h5 className={styles.alert_title}>결제 안내</h5>
              <div className={styles.alert_description}>
                구독은 자동 갱신되며, 언제든지 구독을 취소할 수 있습니다. 취소 시 현재 구독 기간이 끝날 때까지 서비스를
                이용할 수 있습니다.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <button className={styles.payButton} onClick={handlePayClick}>
            <span className={styles.icon}>→</span>
            <span>결제 진행</span>
          </button>

          <button className={styles.backButton}>
            <span className={styles.icon}>←</span>
            <span>이전으로</span>
          </button>
        </div>
      </div>

      {/* ✅ 모달 렌더링 */}

      <PaymentModal isOpen={isPayModalOpen} onClose={closePayModal} cardData={cardData} />
      {/* 결제수단 미등록 알림 모달 */}
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={closeWarningModal}
        type={modalType}
        isVisible={isModalVisible}
        onConfirm={handleCardRegister}
      />
    </div>
  );
}

export default PaymentPage;
