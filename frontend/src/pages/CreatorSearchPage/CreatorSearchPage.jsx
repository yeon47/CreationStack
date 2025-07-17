import React, { useEffect, useState } from "react";
import { Pagination } from "../../components/Search/Pagination/Pagination";
import { CreatorListSection } from "../../components/Search/SearchCreator/CreatorListSection/CreatorListSection";
import { CreatorSearching } from "../../components/Search/SearchCreator/CreatorSearching/CreatorSearching";
import { searchCreator } from "../../api/search";
import "./CreatorSearchPage.css";

export const CreatorSearchPage = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [creators, setCreators] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const result = await searchCreator(page, keyword);
        if (!result || !result.contents) {
          setCreators([]);
          setTotalPages(0);
          return;
        }

        const mapped = result.contents.map((item) => ({
          nickname: item.creator.nickname,
          job: item.creator.job,
          bio: item.creator.bio,
          profileImageUrl: item.creator.profile_image_url,
          subscriberCount: item.creator.subscriber_count,
        }));
        setCreators(mapped);
        setTotalPages(result.total_pages);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      }
    };

    fetchCreators();
  }, [page, keyword]);

  return (
    <div className="creator-search-page" data-model-id="84:71">
      <div className="team-section-wrapper">
        <div className="team-section">
          <CreatorSearching
            inputValue={inputValue}
            setInputValue={setInputValue}
            setKeyword={setKeyword}
            setPage={setPage}
          />
          <CreatorListSection creators={creators} />
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>
    </div>
  );
};
