import axios from "axios";

/*
PortOne 관련 API


*/

// DB에 저장된 카드 정보 조회
// export const getPaymentMethods = async () => {
    
//     const res = await axios.get('http://localhost:8080/api/payments', {
//         headers: {
//             "Content-Type":"application.json"
//         }
//     });
//     return res;
// }

//포트원 SDK 호출
export const requestIssueBillingKey = async () => {
    const storeId = process.env.REACT_APP_STORE_ID;
    const channelKey = process.env.REACT_APP_CHANNEL_KEY;

    const response = await requestIssueBillingKey({
            storeId: storeId, //상점 아이디. 포트원 계정에 생성된 상점 식별하는 고유값.
            channelKey: channelKey, //채널 키. 포트원에 등록된 결제 채널
            billingKeyMethod: "CARD", //빌링키 발급 수단
    });
    return response;
}
