import React,{useEffect, useState} from "react";
import styles from "./paymentMethod.module.css";
import PaymentMethodCard from "./PaymentMethodCard";
// import getPaymentMethods from "../../api/portone";

// 카드 리스트(결제수단관리))
function PaymentMethodList() {
    const [cards, setCards] = useState([]); // 사용자 카드 목록
    const userId = 1; //임시 userId

    useEffect(() => {
        // getPaymentMethods()
        // .then(setCards)
        // .catch(err => console.error(err));
        
    }, [])
    
    return (
        <div className={styles.cardList_container}>
            {cards.map((card, i) => (
                 <PaymentMethodCard key={i} card={card} />
             ))}
        </div>
    );
}

export default PaymentMethodList;