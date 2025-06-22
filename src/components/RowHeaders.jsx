import React, { memo } from 'react';

/**
 * Renders the sticky row headers (1, 2, 3...).
 * Uses `memo` for performance optimization.
 */
const RowHeaders = memo(
  ({
    visibleRows,
    scrollTop,
    CELL_HEIGHT,
    HEADER_WIDTH,
    HEADER_HEIGHT,
    TOTAL_ROWS,
  }) => {
    return (
      <div
        className="row-headers-container"
        style={{
          transform: `translateY(${-scrollTop}px)`,
          height: `${TOTAL_ROWS * CELL_HEIGHT}px`, // Explicitly set total virtual height
          width: HEADER_WIDTH,
          top: HEADER_HEIGHT,
        }}
      >
        {visibleRows.map((row) => (
          <div
            key={`row-header-${row}`}
            className="row-header"
            style={{
              top: row * CELL_HEIGHT,
              width: HEADER_WIDTH,
              height: CELL_HEIGHT,
            }}
          >
            {row + 1}
          </div>
        ))}
      </div>
    );
  }
);

export default RowHeaders;
