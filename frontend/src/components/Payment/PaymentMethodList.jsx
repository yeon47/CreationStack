import React, { useEffect, useState } from 'react';
import styles from './paymentMethod.module.css';

// 카드 리스트(결제수단관리))
function PaymentMethodList({ cards }) {
  return (
    <div className={styles.card_list_container}>
      {cards.length === 0 && <p>등록된 카드가 없습니다.</p>}
      {cards.map((card, idx) => (
        <div key={idx} className={styles.card_list}>
          <div className={styles.card_info}>
            <div className={styles.card_logo}>
              <img src='/img/woori_logo.png' />
            </div>
            <p>
              <strong>{card.cardName}</strong>
            </p>
            <p>
              {card.cardBrand} / {card.cardType}
            </p>
            <p>{card.cardNumber}</p>
          </div>
          <button>삭제</button>         
        </div>
      ))}
    </div>
  );
}

export default PaymentMethodList;
