import React, { memo } from 'react';
import { colIndexToName } from '../utils';
const ColumnHeaders = memo(
  ({
    visibleCols,
    scrollLeft,
    CELL_WIDTH,
    HEADER_WIDTH,
    HEADER_HEIGHT,
    TOTAL_COLS,
  }) => {
    return (
      <div
        className="column-headers-container"
        style={{
          transform: `translateX(${-scrollLeft}px)`,
          width: `${TOTAL_COLS * CELL_WIDTH}px`,
          height: HEADER_HEIGHT,
          left: HEADER_WIDTH,
        }}
      >
        {visibleCols.map((col) => (
          <div
            key={`col-header-${col}`}
            className="column-header"
            style={{
              left: col * CELL_WIDTH,
              width: CELL_WIDTH,
              height: HEADER_HEIGHT,
            }}
          >
            {colIndexToName(col)}
          </div>
        ))}
      </div>
    );
  }
);

export default ColumnHeaders;
