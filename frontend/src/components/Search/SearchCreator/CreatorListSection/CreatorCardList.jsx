import React from 'react';
import './CreatorCardList.css';

export const CreatorCardList = ({ contents = [], className }) => {
  return (
    <div className={`creator-card-list ${className}`}>
      {contents.map(creator => (
        <div className="creator-card-item" key={creator?.id}>
          <div className="container-section">
            <div
              className="profile-image"
              style={{
                backgroundImage: `url(${creator?.profileImageUrl})`,
              }}
            />
            <div className="text-section">
              <div className="text-section-2">
                <div className="name-and-job-text">
                  <div className="name-text">{creator?.nickname}</div>
                  <div className="job-text">{creator?.job}</div>
                  {creator?.subscriberCount != null && (
                    <div className="member-count-text">구독자 수 {creator?.subscriberCount}명</div>
                  )}
                </div>
                <p className="supporting-text">{creator?.bio}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
