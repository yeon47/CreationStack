import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Pagination } from '../../../components/pagination';
import styles from './UserMainPage.module.css';
import { UserInfo } from '../../../components/MainPage/UserInfo/UserInfo';
import CreatorCardList from '../../../components/CreatorCard/CreatorCardList';
import logo from '../../../assets/img/logo.svg';

export const UserMainPage = () => {
  const { nickname } = useParams();   // URL에서 닉네임 추출
  console.log('닉네임:', nickname);
  const [user, setUser] = useState(null);
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    if (!nickname) return;

    // 1. 사용자 정보 불러오기
    axios
      .get(`/api/user/public/${encodeURIComponent(nickname)}`)
      .then(res => {
        const data = res.data;
        console.log(data);
        setUser(data);

        // 2. 해당 유저의 구독한 크리에이터 목록 불러오기
        return axios.get(`/api/users/${data.nickname}/subscriptions`);
      })
      .then(res => {
        console.log('크리에이터 목록 응답:', res.data);
        setCreators(res.data);
      })
      .catch(err => {
        console.error('크리에이터 정보 또는 콘텐츠 불러오기 실패', err);
      });
  }, [nickname]);

  if (!user || !creators) return null;

  return (
    <div className={styles.userMainPage}>
      <UserInfo
        user={{
          profileImage: user.profileImageUrl ?? logo,
          nickname: user.nickname,
          bio: user.bio,
        }}
      />
      <div className={styles.content}>
        <h1 className={styles.title}>구독한 크리에이터 목록</h1>
        <CreatorCardList creators={creators} />
      </div>
    </div>
  );
};
