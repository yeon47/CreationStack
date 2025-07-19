// PaymentPage.jsx
import React, { useEffect, useState } from 'react';
import SubscriptionDetails from '../../components/Payment/SubscriptionDetails';
import PaymentModal from '../../components/Payment/PaymentModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const cardData = [
    {
      brand: 'Visa',
      number: '**** **** **** 1234',
      expired: '12/28',
      bank: '신한은행',
    },
    {
      brand: 'MasterCard',
      number: '**** **** **** 5678',
      expired: '08/27',
      bank: '국민은행',
    },
    {
      brand: 'Toss',
      number: '**** **** **** 4321',
      expired: '03/26',
      bank: '토스뱅크',
    },
  ];

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

  return (
    <div className={styles.summary_container}>
      <div className={styles.card}>
        <div className={styles.card_content}>
          {/* Header */}
          <div className={styles.summary_header}>
            <h1 className={styles.summary_title}>결제 요약</h1>
            <p className={styles.summary_subtitle}>구독 정보를 확인하고 결제를 진행하세요</p>
          </div>

          {/* <SubscriptionSummary 
                      creator={creator},
                  subscriptionDetails={subscriptionDetails},
              benefits={benefits}
                  /> */}

          {/* Creator Information */}
          <div className={styles.creator_info}>
            <img className={styles.creator_image} src={creator.image} alt="Creator" />
            <div className={styles.creator_detail}>
              <p className={styles.creator_name}>{creator.name}</p>
              <p className={styles.creator_role}>크리에이터</p>
            </div>
          </div>

          <SubscriptionDetails subscriptionDetails={subscriptionDetails} benefits={benefits} />

          {/* Benefits List */}
          {/* <div className={styles.benefits_box}>
            <h3 className={styles.benefits_title}>구독 혜택</h3>
            <ul className={styles.benefits_list}>
              {benefits.map((benefit, index) => (
                <li key={index} className={styles.benefit_item}>
                  <span className={styles.check}>✔</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div> */}

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
          <button className={styles.payButton} onClick={openModal}>
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

      <PaymentModal isOpen={isModalOpen} onClose={closeModal} cardData={cardData} />
    </div>
  );
}

export default PaymentPage;
