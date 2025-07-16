import React,{useEffect} from "react";

function PaymentMethodCard({ card }) {
  return (
    <div className={styles.card_container}>
      <div className={styles.content}>

        <div className={styles.cardInfo}>
          <div>{card.bankName}</div>
          <div>{card.accountNumber}</div>      
        </div>
        <button className={styles.deleteButton}>삭제</button>
     </div>

    </div>
  );
}

export default PaymentMethodCard;