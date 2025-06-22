import React, { memo } from 'react';

const FormulaBar = memo(
  ({
    currentCellName,
    formulaInput,
    onInputChange,
    onInputBlur,
    onInputKeyPress,
    formulaBarRef,
  }) => {
    return (
      <div className="formula-bar-container">
        <div className="cell-name-display">{currentCellName}</div>
        <input
          ref={formulaBarRef}
          type="text"
          value={formulaInput}
          onChange={onInputChange}
          onBlur={onInputBlur}
          onKeyDown={onInputKeyPress}
          className="formula-input"
          placeholder="Enter value or formula (e.g., =A1+B1)"
        />
      </div>
    );
  }
);

export default FormulaBar;
