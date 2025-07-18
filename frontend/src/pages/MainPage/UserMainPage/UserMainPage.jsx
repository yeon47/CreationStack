import React from 'react';
import { Pagination } from '../../../components/pagination';
import styles from './UserMainPage.module.css';
import { UserInfo } from '../../../components/MainPage/UserInfo/UserInfo';
import CreatorCardList from '../../../components/CreatorCard/CreatorCardList';

export const UserMainPage = () => {
  // 실제 애플리케이션에서는 이 데이터를 API로부터 가져오게 됩니다.
  // 예를 들어 useState와 useEffect 훅을 사용하면 다음과 같습니다:
  //
  // const [creators, setCreators] = React.useState([]);
  //
  // React.useEffect(() => {
  //   fetch('/api/creators') // 실제 API 엔드포인트로 변경하세요
  //     .then(response => response.json())
  //     .then(data => setCreators(data))
  //     .catch(error => console.error('크리에이터 데이터를 불러오는 중 오류 발생:', error));
  // }, []);

  return (
    <div className={styles.userMainPage}>
      <UserInfo
        user={{
          profileImage: 'https://c.animaapp.com/md45uvjzPxvxqT/img/profilebutton-1.png',
          nickname: '샘플유저',
          bio: '샘플유저 바이오 공간입니다.',
        }}
      />
      <div className={styles.content}>
        <h1 className={styles.title}>구독한 크리에이터 목록</h1>
        <CreatorCardList />
      </div>
    </div>
  );
};
