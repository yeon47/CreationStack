import React from "react";
import { ContentCardList } from "./ContentCardList";
import "./ContentContainer.css";

export const ContentContainer = ({ creators = [] }) => {
  if (creators.length === 0) {
    return (
        <div className="no-search-result">검색 결과가 없습니다.</div>
    );
  }
  

  return (
    <div className="content-container">
      <ContentCardList
        className="content-card-list-instance"
        divClassName="design-component-instance-node"
        divClassNameOverride="design-component-instance-node"
        textClassName="design-component-instance-node"
        textClassNameOverride="design-component-instance-node"
        contents={creators.slice(0, 3)}
      />
      <ContentCardList
        className="content-card-list-instance"
        contents={creators.slice(3, 6)}
      />
      <ContentCardList
        className="content-card-list-instance"
        contents={creators.slice(6, 9)}
      />
    </div>
  );
};
