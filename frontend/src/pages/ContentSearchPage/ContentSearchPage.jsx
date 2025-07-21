import React, { useEffect, useState } from "react";
import { ContentContainer } from "../../components/Search/SearchContent/ContentContainer/ContentContainer";
import { Searching } from "../../components/Search/SearchContent/Searching/Searching";
import { Pagination } from "../../components/Search/Pagination/Pagination";
import { ContentFilterModal } from "../../components/Search/Filter/ContentFilterModal";
import { searchContent } from "../../api/search";
import "./ContentSearchPage.css";

export const ContentSearchPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [creators, setCreators] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const result = await searchContent(page, keyword, size);
        if (!result || !result.contents) {
          setCreators([]);
          setTotalPages(0);
          return;
        }

        const mapped = result.contents.map((item) => ({
          id: item.contentId,
          creator: item.creator.nickname,
          thumbnailUrl: item.thumbnailUrl,
          title: item.title,
          likes: item.likeCount,
          isSubscriber: item.isSubscriber, // 이 값은 API 응답에 따라 달라질 수 있습니다.
          categoryNames: item.categoryNames,
        }));
        setCreators(mapped);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      }
    };

    fetchCreators();
  }, [page, keyword, size]);

  return (
    <div className="content-search-page">
      <div className="team-section">
        <Searching
          inputValue={inputValue}
          setInputValue={setInputValue}
          setKeyword={setKeyword}
          setPage={setPage}
        />
        <div className="filtering">
          <div
            className="dropdown-default"
            onClick={() => setIsFilterOpen(true)}
          >
            <div className="overlap-group">
              <div className="text-wrapper-6">필터</div>
            </div>
          </div>
        </div>
        <ContentContainer contents={creators} />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
      {/* ✅ 필터 모달 표시 */}
      {isFilterOpen && (
        <ContentFilterModal
          onClose={() => setIsFilterOpen(false)}
          onApply={(filter) => {
            console.log("필터 적용됨:", filter);
            setKeyword(filter.category); // 예시: 카테고리를 검색 키워드로 활용
            setPage(0);
            // 추가로 sort, accessType 상태도 저장 가능
          }}
        />
      )}
    </div>
  );
};