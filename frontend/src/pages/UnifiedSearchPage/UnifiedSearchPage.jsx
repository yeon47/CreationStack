import React, { useEffect, useState } from "react";
import { ContentSearchWrapper } from "../../components/Search/SearchUnifined/ContentSearchWrapper/ContentSearchWrapper";
import { Section } from "../../components/Search/SearchUnifined/Section/Section";
import { ContentFilterModal } from "../../components/Search/Filter/ContentFilterModal";
import { searchUnified } from "../../api/search";
import UnifiedCreatorCard from "./UnifiedCreatorCard";
import { SearchResultHeader } from "../../components/Search/SearchUnifined/SearchResultHeader/SearchResultHeader";
import { useNavigate, useLocation } from "react-router-dom";
import "./UnifiedSearchPage.css";

export const UnifiedSearchPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [creators, setCreators] = useState([]);
  const [contents, setContents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlKeyword = queryParams.get("keyword") || "";
    setKeyword(urlKeyword);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!keyword) {
        // 키워드가 없으면 검색을 수행하지 않음
        setCreators([]);
        setContents([]);
        return;
      }
      try {
        const result = await searchUnified({ keyword }); // 인자 구조 맞춤
        console.log("Unified Search API Result:", result);

        // creators
        const creatorMapped = (result.creators || []).map((item) => ({
          name: item.creator?.nickname, // nickname을 name으로 매핑
          profileImageUrl: item.creator?.profileImageUrl,
          description: item.creator?.bio, // bio를 description으로 매핑
          job: item.creator?.job,
          subscriberCount: item.creator?.subscriberCount,
        }));

        // contents
        const contentMapped = (result.contents || []).map((item) => ({
          contentId: item.contentId,
          title: item.title,
          thumbnailUrl: item.thumbnailUrl,
          likeCount: item.likeCount,
          categoryNames: item.categoryNames,
          creator: {
            nickname: item.creator?.nickname,
            profileImageUrl: item.creator?.profileImageUrl,
          },
        }));

        setCreators(creatorMapped);
        setContents(contentMapped);
      } catch (error) {
        console.error("Failed to fetch unified search results:", error);
      }
    };

    fetchData();
  }, [keyword]);

  return (
    <div className="unified-search-page" data-model-id="235:3820">
      <div className="page-layout-wrapper">
        <div className="page-layout">
          <div className="filtering-section">
            <div
              className="dropdown-default"
              onClick={() => setIsFilterOpen(true)}
            >
              <div className="overlap-group">
                <div className="text-wrapper-6">필터</div>
              </div>
            </div>
          </div>
          {creators.length > 0 ? (
            <div className="creator-search">
              <SearchResultHeader
                className="search-result-header-instance"
                onMoreClick={() => navigate("/creators")}
              />
              <div className="unified-creator-card-list">
                {creators.slice(0, 3).map((creator, index) => (
                  <UnifiedCreatorCard key={index} creator={creator} />
                ))}
              </div>
            </div>
          ) : (
            keyword && <div className="no-search-result">크리에이터 검색 결과가 없습니다.</div>
          )}
      {contents.length > 0 ? (
            <div className="content-search">
              <SearchResultHeader
                className="design-component-instance-node"
                text="컨텐츠 검색 결과"
                onMoreClick={() => navigate('/contents')}
              />
              <div className="heading-and-content">
                <ContentSearchWrapper contents={contents} />
              </div>
            </div>
          ) : (
            keyword && <div className="no-search-result">콘텐츠 검색 결과가 없습니다.</div>
          )}
        </div>
      </div>
      {isFilterOpen && (
        <ContentFilterModal
          onClose={() => setIsFilterOpen(false)}
          onApply={(filter) => {
            console.log("필터 적용됨:", filter);
            setKeyword(filter.category); // 예시: 카테고리를 검색 키워드로 활용
            // 추가로 sort, accessType 상태도 저장 가능
          }}
        />
      )}
    </div>
  );
};
