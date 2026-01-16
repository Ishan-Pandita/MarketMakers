/**
 * Pagination helper function
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Number of items per page
 * @param {number} totalItems - Total number of items in database
 * @returns {object} Pagination metadata
 */
const getPaginationData = (page = 1, limit = 10, totalItems = 0) => {
    const currentPage = Math.max(1, parseInt(page));
    const itemsPerPage = Math.max(1, Math.min(100, parseInt(limit))); // Max 100 items per page
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        totalItems,
        skip,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
};

module.exports = { getPaginationData };
