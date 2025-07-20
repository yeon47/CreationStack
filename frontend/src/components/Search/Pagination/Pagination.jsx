import React from "react";
import "./Pagination.css";

export const Pagination = ({ page, totalPages, setPage }) => {
  const handlePageClick = (pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) {
      setPage(pageNum);
    }
  };

  const renderPages = () => {
    const pages = [];
    const maxVisible = 3;
    const showLeftDots = page > 2;
    const showRightDots = page < totalPages - 3;

    let start = Math.max(0, page - 1);
    let end = Math.min(totalPages, start + maxVisible);

    if (showLeftDots) {
      pages.push(
        <div
          key="first"
          className="num-wrapper"
          onClick={() => handlePageClick(0)}
        >
          <div className="num-2">1</div>
        </div>
      );
      pages.push(
        <div key="dots-left" className="num-wrapper">
          <div className="num-3">...</div>
        </div>
      );
    }

    for (let i = start; i < end; i++) {
      pages.push(
        <div
          key={i}
          className={i === page ? "element" : "num-wrapper"}
          onClick={() => handlePageClick(i)}
        >
          <div className={i === page ? "num" : "num-2"}>{i + 1}</div>
        </div>
      );
    }

    if (showRightDots) {
      pages.push(
        <div key="dots-right" className="num-wrapper">
          <div className="num-3">...</div>
        </div>
      );
      pages.push(
        <div
          key={totalPages - 1}
          className="num-wrapper"
          onClick={() => handlePageClick(totalPages - 1)}
        >
          <div className="num-4">{totalPages}</div>
        </div>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <div
        className="prev"
        onClick={() => handlePageClick(page - 1)}
        style={{ opacity: page === 0 ? 0.3 : 1 }}
      >
        <div className="text-wrapper-5">Prev</div>
        <div className="chevron-left">
          <img
            className="vector"
            src="https://cdn-icons-png.flaticon.com/512/271/271220.png"
            alt="prev"
          />
        </div>
      </div>

      <div className="nums">{renderPages()}</div>

      <div
        className="next"
        onClick={() => handlePageClick(page + 1)}
        style={{ opacity: page === totalPages - 1 ? 0.3 : 1 }}
      >
        <div className="prev-2">Next</div>
        <div className="vector-wrapper">
          <img
            className="vector"
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
            alt="prev"
          />
        </div>
      </div>
    </div>
  );
};
