import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentCard } from '../../ContentCard/ContentCard';
import gridStyles from '../../UsePagination/PaginatedGrid.module.css';
import './ContentSection.css';

export const ContentSection = ({ contents = [] }) => {
  return (
    <div className="content-search-wrapper">
      <div className="content-search">
        <div className="section-header">
          <h2 className="section-title">최신 컨텐츠</h2>
        </div>
        <div className="heading-and-content">
          <div className={gridStyles.grid}>
            {contents.map(item => (
              <ContentCard
                key={item.id}
                id={item.id}
                creator={item.creator}
                thumbnailUrl={item.thumbnailUrl}
                title={item.title}
                likes={item.likes}
                categoryNames={item.categoryNames}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
