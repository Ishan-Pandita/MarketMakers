// src/components/Pagination.jsx — Light Theme
import { Link } from "react-router-dom";

function Pagination({ pagination, baseUrl }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {hasPrevPage ? (
        <Link to={`${baseUrl}?page=${currentPage - 1}`} className="px-4 py-2 bg-white border border-slate-border rounded-xl text-sm font-semibold text-slate-body hover:bg-surface-subtle hover:border-indigo-200 transition-all">
          ← Previous
        </Link>
      ) : (
        <button disabled className="px-4 py-2 bg-surface-subtle border border-slate-border/50 rounded-xl text-sm text-slate-light cursor-not-allowed">
          ← Previous
        </button>
      )}

      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-muted">...</span>;
          }
          return (
            <Link
              key={page}
              to={`${baseUrl}?page=${page}`}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentPage === page
                  ? "bg-indigo-500 text-white shadow-glow-indigo"
                  : "bg-white border border-slate-border text-slate-body hover:bg-indigo-50 hover:border-indigo-200"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {hasNextPage ? (
        <Link to={`${baseUrl}?page=${currentPage + 1}`} className="px-4 py-2 bg-white border border-slate-border rounded-xl text-sm font-semibold text-slate-body hover:bg-surface-subtle hover:border-indigo-200 transition-all">
          Next →
        </Link>
      ) : (
        <button disabled className="px-4 py-2 bg-surface-subtle border border-slate-border/50 rounded-xl text-sm text-slate-light cursor-not-allowed">
          Next →
        </button>
      )}
    </div>
  );
}

export default Pagination;
