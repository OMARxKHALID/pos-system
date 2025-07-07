import { useState, useMemo, useEffect, useCallback } from "react";

export function usePagination(items = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  // Computed values
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Reset page if it exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Navigation functions
  const goToPage = useCallback(
    (page) => {
      if (totalItems === 0) return;
      const validPage = Math.max(1, Math.min(page, totalPages));
      if (validPage !== currentPage) {
        setCurrentPage(validPage);
      }
    },
    [totalItems, totalPages, currentPage]
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Computed states
  const hasNextPage = currentPage < totalPages && totalPages > 1;
  const hasPreviousPage = currentPage > 1;

  return {
    // Data
    currentPage,
    paginatedItems,
    totalPages,
    totalItems,

    // Navigation
    goToPage,
    nextPage,
    previousPage,
    resetPagination,

    // States
    hasNextPage,
    hasPreviousPage,
  };
}
