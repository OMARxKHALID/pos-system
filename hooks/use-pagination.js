import { useState, useMemo, useEffect, useCallback } from "react";

export function usePagination(items = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

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

  const hasNextPage = currentPage < totalPages && totalPages > 1;
  const hasPreviousPage = currentPage > 1;

  return {
    currentPage,
    paginatedItems,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
    hasNextPage,
    hasPreviousPage,
  };
}
