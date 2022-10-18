import React, { useState, useEffect } from 'react';

import { usePagination, DOTS } from '../../hooks/usePagination';

import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { Container, PageList, PageItem } from './styles';

function Pagination({
  currentPage,
  totalCount,
  perPage,
  onPageChange,
  siblingCount = 2,
}) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    perPage,
  });

  /*
   *  Will not render component if there is less than 2 pages
   */

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  function handleNext() {
    onPageChange(currentPage + 1);
  }

  function handlePrevious() {
    onPageChange(currentPage - 1);
  }

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <Container>
      <button
        className="button small action"
        disabled={currentPage === 1}
        onClick={handlePrevious}
      >
        <MdNavigateBefore size={18} />
      </button>
      <PageList>
        {paginationRange.map((pageNumber, index) => {
          // If the pageItem is a DOT, render the DOTS unicode character
          if (pageNumber === DOTS) {
            return (
              <PageItem key={index} className="dots">
                &#8230;
              </PageItem>
            );
          }

          // Render our Page Pills
          return (
            <PageItem
              key={index}
              selected={pageNumber === currentPage}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </PageItem>
          );
        })}
      </PageList>
      {/* <small>
          Página {pages.current} de {pages.last}
        </small> */}
      <button
        className="button small action"
        disabled={currentPage === lastPage}
        onClick={handleNext}
      >
        <MdNavigateNext size={18} />
      </button>
    </Container>
  );
}

export default Pagination;
