import React from "react";
import { useNavigate } from "react-router-dom";
import { Paidicon5 } from "../../icons/Paidicon5";
import "./ContentCardList.css";

export const ContentCardList = ({
  contents = [],
  className,
  textClassName,
}) => {
  const navigate = useNavigate();
  return (
    <div className={`content-card-list ${className}`}>
      {contents.map((content, index) => (
        <div
          className="div-2"
          key={index}
          onClick={() => navigate(`/contents/${content?.contentId}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="image">
            {content?.thumbnailUrl && (
              <img
                className="thumbnail"
                src={content?.thumbnailUrl}
                alt="썸네일"
              />
            )}
            {content && <Paidicon5 className="paid-icon" />}
          </div>
          <div className="div-3">
            <div className="div-4">
              <div className="author-text">{content?.nickname}</div>
              <div className="div-wrapper">
                <p className="p">{content?.title}</p>
              </div>
            </div>
            {content?.likeCount != null && (
              <div className="categories">
                <div className="group-2">
                  <img
                    className="free-icon-like"
                    alt="Free icon like"
                    src="https://c.animaapp.com/md5omgh5oM1d1X/img/free-icon-like-6924834-1-11.png"
                  />
                  <div className="text-wrapper-5">({content?.likeCount})</div>
                </div>
              </div>
            )}
            {content?.categoryNames?.length > 0 && (
              <div className="categories-2">
                {(content?.categoryNames || []).map((name, i) => (
                  <div key={i} className="badge-base">
                    <div className={`text ${textClassName}`}>{name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
