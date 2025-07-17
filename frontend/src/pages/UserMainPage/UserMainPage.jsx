import React from 'react';
import { Pagination } from '../../components/pagination';
import styles from './UserMainPage.module.css';
import CreatorCard from '../../components/CreatorCard/CreatorCard';
import { UserInfo } from '../../components/UserInfo/UserInfo';


// 샘플 데이터. API로 fetch 해야함.
const sampleCreators = [
  {
    id: 1,
    name: '스택빌더',
    job: 'Backend Developer',
    subscriberCount: 121,
    description: '10년 넘게 개발 현장에서 쌓은 경험을 바탕으로, 여러분께 도움이 될 만한 기술 강좌들을 꾸준히 만들고 있어요. 실제 프로젝트에 바로 적용할 수 있는 실용적인 팁들을 아낌없이 공유해 드리고자 합니다.',
    profileImageUrl: 'https://c.animaapp.com/md5t08zk5wI0hj/img/profileimagesection.svg',
  },
  {
    id: 2,
    name: '디자인프로',
    job: 'UI/UX Designer',
    subscriberCount: 245,
    description: '사용자 중심의 아름답고 직관적인 디자인을 추구합니다. 실무에서 바로 사용할 수 있는 디자인 팁과 노하우를 공유합니다.',
    profileImageUrl: 'https://c.animaapp.com/md5t08zk5wI0hj/img/profileimagesection.svg', // Using a placeholder image
  },
  {
    id: 3,
    name: '코딩위자드',
    job: 'Frontend Developer',
    subscriberCount: 488,
    description: '최신 프론트엔드 기술과 트렌드를 다룹니다. 리액트, 뷰, 앵귤러 등 다양한 프레임워크에 대한 깊이 있는 인사이트를 제공합니다.',
    profileImageUrl: 'https://c.animaapp.com/md5t08zk5wI0hj/img/profileimagesection.svg', // Using a placeholder image
  },
];

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
      <UserInfo user={{ 
        profileImage: 'https://c.animaapp.com/md45uvjzPxvxqT/img/profilebutton-1.png', 
        nickname: '샘플유저', 
        bio: '샘플유저 바이오 공간입니다.' }} />
      <div className={styles.content}>
        <h1 className={styles.title}>구독한 크리에이터 목록</h1>
        <div className={styles.creatorCardList}>
          {sampleCreators.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </div>
      <div className={styles.pagination}>
        <Pagination />
      </div>
    </div>
  );
};
