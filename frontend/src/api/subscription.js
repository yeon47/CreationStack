import axios from 'axios';

/**
 * 현재 로그인한 사용자의 구독 목록 조회
 * @returns {Promise} 구독 정보 배열
 */
export const getMySubscriptions = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get('/api/users/me/subscriptions', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.subscriptions;
  } catch (err) {
    console.log('구독 목록 조회 실패: '. err);
    throw err;
  }
};

export const getSubscribedCreators = async () => {
  try {

    const response = await axios.get('/api/users/me/subscriptions');

    return response.data.subscriptions;
  } catch (err) {
    console.log('구독 목록 조회 실패: '. err);
    throw err;
  }
};
