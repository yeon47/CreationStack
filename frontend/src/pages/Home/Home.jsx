import React, { useEffect, useState } from 'react';
import { BannerSection } from '../../components/Home/BannerSection/BannerSection';
import { ContentSection } from '../../components/Home/ContentSection/ContentSection';
import { CreatorSection } from '../../components/Home/CreatorSection/CreatorSection';
import { searchUnified } from '../../api/search';
import './Home.css';

export const Home = () => {
  const [creators, setCreators] = useState([]);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const result = await searchUnified({
          searchMode: 'ALL', // 통합 검색
        });

        if (result) {
          if (result.creators) {
            const mappedCreators = result.creators.map(item => ({
              name: item.creator.nickname,
              job: item.creator.job,
              description: item.creator.bio,
              profileImageUrl: item.creator.profileImageUrl,
              subscriberCount: item.creator.subscriberCount,
            }));
            setCreators(mappedCreators.slice(0, 3)); // 3개만 표시;
          }
          
          if (result.contents) {
            const mappedContents = result.contents.map(item => ({
              id: item.contentId,
              creator: item.creator.nickname,
              thumbnailUrl: item.thumbnailUrl,
              title: item.title,
              likes: item.likeCount,
              isSubscriber: item.isSubscriber,
              categoryNames: item.categoryNames,
            }));
            setContents(mappedContents.slice(0, 6)); // 6개만 표시
          }
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page" data-model-id="89:971">
      <div className="home-section-wrapper">
        <div className="home-section">
          <BannerSection />
          <CreatorSection creators={creators} />
          <ContentSection contents={contents} />
        </div>
      </div>
    </div>
  );
};
