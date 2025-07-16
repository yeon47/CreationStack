import React, { useEffect } from "react";
import styles from "./paymentMethodManagementPage.module.css";
import PaymentMethodList from "../../components/Payment/PaymentMethodList";
import { requestIssueBillingKey } from "../../api/portone";

// paymentMethodManagement page
function PaymentMethodManagementPage() {

    const handleCardRegister = async () => {
        const issueResponse = await requestIssueBillingKey();

        if (issueResponse.code !== undefined) {
            alert(issueResponse.message)
            return;
        }
        alert(issueResponse.billingKey)
        }
    
    return (
        <div className={styles.payment_container}>
            {/* 결제수단관리 헤더 */}
            <div className={styles.header}>
                <p className={styles.title}>결제수단 관리</p>
                <p className={styles.subTitle}>등록된 결제수단을 관리하고 새로운 결제수단을 추가할 수 있습니다</p>
            </div>

            {/* 등록된 카드 리스트 */}
            <PaymentMethodList />
            <div className={styles.register}>
                <button className={styles.registerButton} onClick={handleCardRegister}>
                    <p>카드 등록</p>
                </button>
            </div>
        </div>
    );    
}

export default PaymentMethodManagementPage;