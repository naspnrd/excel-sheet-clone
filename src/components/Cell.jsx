import React, { memo } from 'react';

const Cell = memo(
  ({
    row,
    col,
    cellData,
    isEditing,
    isActive,
    onClick,
    onDoubleClick,
    inputRef,
    formulaInput,
    onInputChange,
    onInputBlur,
    onInputKeyPress,
    CELL_WIDTH,
    CELL_HEIGHT,
  }) => {
    let cellClasses = 'cell';
    if (isActive) cellClasses += ' cell-active';
    if (isEditing) cellClasses += ' cell-editing';

    return (
      <div
        className={cellClasses}
        style={{
          left: col * CELL_WIDTH,
          top: row * CELL_HEIGHT,
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
        }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={formulaInput}
            onChange={onInputChange}
            onBlur={onInputBlur}
            onKeyDown={onInputKeyPress}
            className="cell-input"
            autoFocus
          />
        ) : (
          <span className="cell-display-value">
            {cellData ? cellData.displayValue : ''}
          </span>
        )}
      </div>
    );
  }
);

export default Cell;
