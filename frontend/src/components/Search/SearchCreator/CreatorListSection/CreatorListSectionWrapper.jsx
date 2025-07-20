import React from "react";
import { CreatorCardList } from "./CreatorCardList";
import "./CreatorListSectionWrapper.css";

export const CreatorListSectionWrapper = ({ className, creators = [] }) => {
  if (creators.length === 0) {
    return (
      <div className={`creator-list-section-wrapper ${className}`}>
        <div className="no-search-result">검색 결과가 없습니다.</div>
      </div>
    );
  }
  
  return (
    <div className={`creator-list-section-wrapper ${className}`}>
      <CreatorCardList
        className="design-component-instance-node"
        divClassName="creator-card-list-instance"
        memberCountTextClassName="creator-card-list-2"
        profileImageClassName="creator-card-list-instance"
        profileImageClassNameOverride="creator-card-list-instance"
        contents={creators.slice(0, 3)}
      />
      <CreatorCardList
        className="design-component-instance-node"
        divClassName="creator-card-list-instance"
        profileImageClassName="creator-card-list-instance"
        profileImageClassNameOverride="creator-card-list-instance"
        contents={creators.slice(3, 6)}
      />
      <CreatorCardList
        className="design-component-instance-node"
        divClassName="creator-card-list-instance"
        profileImageClassName="creator-card-list-instance"
        profileImageClassNameOverride="creator-card-list-instance"
        contents={creators.slice(6, 9)}
      />
    </div>
  );
};
