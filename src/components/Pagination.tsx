import React from "react";

interface PaginationProps {
  nPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({
  nPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  return (
    <nav className="flex justify-center pt-6 pb-8">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <a
            href="#"
            className="ml-0 block rounded-l-lg border border-gray-200 bg-gray-900 px-3 py-2 leading-tight text-gray-200 hover:border-gray-400 hover:text-gray-400"
            onClick={prevPage}
          >
            <span className="sr-only">Previous</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </li>
        {pageNumbers.map((pgNumber) => (
          <li key={pgNumber}>
            <a
              className={`${
                currentPage === pgNumber
                  ? "hover z-10 border border-gray-300 bg-purple-700 px-3 py-2 leading-tight"
                  : "border border-gray-300 px-3 py-2 leading-tight hover:border-gray-400 hover:text-gray-400"
              }`}
              onClick={() => setCurrentPage(pgNumber)}
              href="#"
            >
              {pgNumber}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#"
            className="block rounded-r-lg border border-gray-200 bg-gray-900 px-3 py-2 leading-tight text-gray-200 hover:border-gray-400 hover:text-gray-400"
            onClick={nextPage}
          >
            <span className="sr-only">Next</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
