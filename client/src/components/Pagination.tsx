import React from "react";

interface PaginationProps {
  pageCount: number; // Total number of pages
  currentPage: number; // Current active page
  setPage: (page: number) => void; // Function to update the page
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  setPage,
}) => {
  return (
    <div className="join">
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
        <input
          key={page}
          className={`join-item btn btn-square ${
            page === currentPage ? "btn-active" : "btn-warning bg-opacity-20 text-white"
          }`}
          type="radio"
          name="pagination"
          aria-label={`${page}`}
          checked={page === currentPage}
          onChange={() => setPage(page)}
        />
      ))}
    </div>
  );
};

export default Pagination;
