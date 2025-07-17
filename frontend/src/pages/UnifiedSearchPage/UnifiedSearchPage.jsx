import React, { useEffect, useState } from "react";
import { ContentSearchWrapper } from "../../components/Search/SearchUnifined/ContentSearchWrapper/ContentSearchWrapper";
import { Section } from "../../components/Search/SearchUnifined/Section/Section";
import { ContentFilterModal } from "../../components/Search/Filter/ContentFilterModal";
import { searchUnified } from "../../api/search";
import "./UnifiedSearchPage.css";

export const UnifiedSearchPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [creators, setCreators] = useState([]);
  const [contents, setContents] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await searchUnified({ keyword }); // 인자 구조 맞춤

        // creators
        const creatorMapped = (result.creators || []).map((item) => ({
          nickname: item.creator?.nickname,
          profileImageUrl: item.creator?.profile_image_url,
          bio: item.creator?.bio,
          job: item.creator?.job,
          subscriberCount: item.creator?.subscriber_count,
        }));

        // contents
        const contentMapped = (result.contents || []).map((item) => ({
          content_id: item.content_id,
          title: item.title,
          thumbnail_url: item.thumbnail_url,
          like_count: item.like_count,
          category_names: item.category_names,
          creator: {
            nickname: item.creator?.nickname,
            profileImageUrl: item.creator?.profile_image_url,
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
          {creators.length > 0 && <Section creators={creators} />}
          {contents.length > 0 && <ContentSearchWrapper contents={contents} />}
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
