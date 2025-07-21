import React from 'react';
import CreatorCard from './CreatorCard';
import { PaginatedGrid } from '../UsePagination/PaginatedGrid';

const CreatorCardList = ({ creators }) => {
  return (
    <PaginatedGrid
      items={creators}
      itemsPerPage={5} 
      renderItem={(creator) => (
        <CreatorCard key={creator.creatorId}
          nickname={creator.creatorNickname}
          job={creator.job}
          profileImage={creator.profileImageUrl}

          bio={creator.bio} />
      )}
    />
  );
};

export default CreatorCardList;


