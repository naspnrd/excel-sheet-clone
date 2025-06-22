import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to manage scroll position and determine visible grid cells for virtualization.
 * @param {number} totalRows Total number of rows in the virtual grid.
 * @param {number} totalCols Total number of columns in the virtual grid.
 * @param {number} cellWidth Width of a single cell in pixels.
 * @param {number} cellHeight Height of a single cell in pixels.
 * @param {number} headerWidth Width of the row header column in pixels.
 * @param {number} headerHeight Height of the column header row in pixels.
 */
export const useGridScroll = (
  totalRows,
  totalCols,
  cellWidth,
  cellHeight,
  headerWidth,
  headerHeight
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const gridContainerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (gridContainerRef.current) {
      setScrollTop(gridContainerRef.current.scrollTop);
      setScrollLeft(gridContainerRef.current.scrollLeft);
    }
  }, []);

  useEffect(() => {
    const grid = gridContainerRef.current;
    if (grid) {
      grid.addEventListener('scroll', handleScroll);
      return () => grid.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const numVisibleRows = Math.ceil(window.innerHeight / cellHeight) + 5;
  const numVisibleCols = Math.ceil(window.innerWidth / cellWidth) + 5;

  const startRow = Math.max(0, Math.floor(scrollTop / cellHeight));
  const endRow = Math.min(totalRows, startRow + numVisibleRows);

  const startCol = Math.max(0, Math.floor(scrollLeft / cellWidth));
  const endCol = Math.min(totalCols, startCol + numVisibleCols);

  const visibleRows = Array.from(
    { length: endRow - startRow },
    (_, i) => startRow + i
  );
  const visibleCols = Array.from(
    { length: endCol - startCol },
    (_, i) => startCol + i
  );

  return {
    gridContainerRef,
    scrollTop,
    scrollLeft,
    visibleRows,
    visibleCols,
  };
};
