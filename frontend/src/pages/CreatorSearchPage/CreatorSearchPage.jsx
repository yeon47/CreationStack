import React, { useEffect, useState } from "react";
import { CreatorListSection } from "../../components/Search/SearchCreator/CreatorListSection/CreatorListSection";
import { CreatorSearching } from "../../components/Search/SearchCreator/CreatorSearching/CreatorSearching";
import { searchCreator } from "../../api/search";
import "./CreatorSearchPage.css";

export const CreatorSearchPage = () => {
  const [creators, setCreators] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const result = await searchCreator(0, keyword); // Always fetch from page 0 for new searches
        if (!result || !result.contents) {
          setCreators([]);
          return;
        }

        const mapped = result.contents.map((item) => ({
          name: item.creator.nickname, // nickname을 name으로 매핑
          job: item.creator.job,
          description: item.creator.bio, // bio를 description으로 매핑
          profileImageUrl: item.creator.profileImageUrl,
          subscriberCount: item.creator.subscriberCount,
        }));
        setCreators(mapped);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      }
    };

    fetchCreators();
  }, [keyword]);

  return (
    <div className="creator-search-page" data-model-id="84:71">
      <div className="team-section-wrapper">
        <div className="team-section">
          <CreatorSearching
            inputValue={inputValue}
            setInputValue={setInputValue}
            setKeyword={setKeyword}
            setPage={() => {}} // setPage is no longer needed here
          />
          <CreatorListSection creators={creators} />
        </div>
      </div>
    </div>
  );
};
