// Reusable Pagination Component
import { Link } from "react-router-dom";

function Pagination({ pagination, baseUrl }) {
    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first, last, current, and nearby pages
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

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            {hasPrevPage ? (
                <Link
                    to={`${baseUrl}?page=${currentPage - 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    ← Previous
                </Link>
            ) : (
                <button
                    disabled
                    className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                >
                    ← Previous
                </button>
            )}

            {/* Page Numbers */}
            <div className="flex gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={page}
                            to={`${baseUrl}?page=${page}`}
                            className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                                    ? "bg-primary-600 text-white font-semibold"
                                    : "bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            {hasNextPage ? (
                <Link
                    to={`${baseUrl}?page=${currentPage + 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Next →
                </Link>
            ) : (
                <button
                    disabled
                    className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                >
                    Next →
                </button>
            )}
        </div>
    );
}

export default Pagination;
