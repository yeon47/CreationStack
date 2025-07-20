import React from 'react';
import CreatorCard from './CreatorCard';
import { PaginatedGrid } from '../UsePagination/PaginatedGrid';

// 샘플 데이터. API로 fetch 해야함.
const sampleCreators = [
  {
    id: 1,
    name: '스택빌더',
    job: 'Backend Developer',
    subscriberCount: 121,
    description:
      '10년 넘게 개발 현장에서 쌓은 경험을 바탕으로, 여러분께 도움이 될 만한 기술 강좌들을 꾸준히 만들고 있어요. 실제 프로젝트에 바로 적용할 수 있는 실용적인 팁들을 아낌없이 공유해 드리고자 합니다.',
    profileImageUrl: 'https://c.animaapp.com/md5t08zk5wI0hj/img/profileimagesection.svg',
  },
  {
    id: 2,
    name: '디자인프로',
    job: 'UI/UX Designer',
    subscriberCount: 245,
    description:
      '사용자 중심의 아름답고 직관적인 디자인을 추구합니다. 실무에서 바로 사용할 수 있는 디자인 팁과 노하우를 공유합니다.',
    profileImageUrl: 'https://c.animaapp.com/md5t08zk5wI0hj/img/profileimagesection.svg',
  },
  {
    id: 3,
    name: '코딩위자드',
    job: 'Frontend Developer',
    subscriberCount: 488,
    description:
      '최신 프론트엔드 기술과 트렌드를 다룹니다. 리액트, 뷰, 앵귤러 등 다양한 프레임워크에 대한 깊이 있는 인사이트를 제공합니다.',
    profileImageUrl: 'https://c.animaapp.com/md5t08zk5wI0hj/img/profileimagesection.svg',
  },
];

const CreatorCardList = () => {
  return (
    <PaginatedGrid
      items={sampleCreators}
      itemsPerPage={5} 
      renderItem={(creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      )}
    />
  );
};

export default CreatorCardList;


