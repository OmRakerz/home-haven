import React from "react";

const Pagination = ({ page, pageSize, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const maxVisiblePages = 5; // Максимальное количество видимых страниц

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  // Генерация массива страниц для отображения
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <section className="container mx-auto flex justify-center items-center my-8 gap-2">
      <button
        className={`px-4 py-2 border border-gray-300 rounded-xl ${
          page !== 1 && "hover:bg-blue-400 hover:text-white"
        } transition-all duration-300 disabled:opacity-50`}
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Предыдущая
      </button>

      <div className="flex gap-2 mx-2">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`w-10 h-10 flex items-center justify-center border ${
              page === pageNumber
                ? "bg-blue-500 text-white"
                : "border-gray-300 hover:bg-blue-400 hover:text-white"
            } rounded-xl transition-all duration-300`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        className={`px-4 py-2 border border-gray-300 rounded-xl ${
          page !== totalPages && "hover:bg-blue-400 hover:text-white"
        } transition-all duration-300 disabled:opacity-50`}
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Следующая
      </button>
    </section>
  );
};

export default Pagination;
