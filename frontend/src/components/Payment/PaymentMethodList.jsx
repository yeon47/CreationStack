import React, { useEffect, useState } from 'react';
import styles from './paymentMethod.module.css';

// 카드 리스트(결제수단관리))
function PaymentMethodList({ cards }) {
  return (
    <div className={styles.card_list_container}>
      {cards.length === 0 && <p>등록된 카드가 없습니다.</p>}
      {cards.map((card, idx) => (
        <div key={idx} className="card-box">
          <p>
            <strong>{card.cardName}</strong>
          </p>
          <p>
            {card.cardBrand} / {card.cardType}
          </p>
          <p>{card.cardNumber}</p>
        </div>
      ))}
    </div>
  );
}

export default PaymentMethodList;
