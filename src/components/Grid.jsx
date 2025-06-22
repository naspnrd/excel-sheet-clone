import React, { useCallback, useRef } from 'react';
import { useGridScroll } from '../hooks/useGridScroll';
import Cell from './Cell';
import ColumnHeaders from './ColumnHeaders';
import RowHeaders from './RowHeaders';

const Grid = ({
  TOTAL_ROWS,
  TOTAL_COLS,
  CELL_WIDTH,
  CELL_HEIGHT,
  HEADER_WIDTH,
  HEADER_HEIGHT,
  cells,
  updateCellValue,
  getCellId,
  activeCell,
  setActiveCell,
  editMode,
  setEditMode,
  formulaInput,
  setFormulaInput,
}) => {
  const { gridContainerRef, scrollTop, scrollLeft, visibleRows, visibleCols } =
    useGridScroll(
      TOTAL_ROWS,
      TOTAL_COLS,
      CELL_WIDTH,
      CELL_HEIGHT,
      HEADER_WIDTH,
      HEADER_HEIGHT
    );

  const inputRef = useRef(null);

  const handleInputBlur = useCallback(() => {
    if (activeCell && editMode) {
      updateCellValue(activeCell.row, activeCell.col, formulaInput);
      setEditMode(false);
      setActiveCell(null);
    }
  }, [
    activeCell,
    editMode,
    formulaInput,
    updateCellValue,
    setEditMode,
    setActiveCell,
  ]);

  const handleInputChange = useCallback(
    (e) => {
      setFormulaInput(e.target.value);
    },
    [setFormulaInput]
  );

  const handleInputKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  }, []);

  const handleCellClick = useCallback(
    (row, col) => {
      setActiveCell({ row, col });
      setEditMode(false);
    },
    [setActiveCell, setEditMode]
  );

  const handleCellDoubleClick = useCallback(
    (row, col) => {
      setActiveCell({ row, col });
      setEditMode(true);
    },
    [setActiveCell, setEditMode]
  );

  return (
    <div className="grid-container-wrapper">
      <div
        className="corner-header-cell"
        style={{ width: HEADER_WIDTH, height: HEADER_HEIGHT }}
      ></div>

      <ColumnHeaders
        visibleCols={visibleCols}
        scrollLeft={scrollLeft}
        CELL_WIDTH={CELL_WIDTH}
        HEADER_WIDTH={HEADER_WIDTH}
        HEADER_HEIGHT={HEADER_HEIGHT}
        TOTAL_COLS={TOTAL_COLS}
      />

      <RowHeaders
        visibleRows={visibleRows}
        scrollTop={scrollTop}
        CELL_HEIGHT={CELL_HEIGHT}
        HEADER_WIDTH={HEADER_WIDTH}
        HEADER_HEIGHT={HEADER_HEIGHT}
        TOTAL_ROWS={TOTAL_ROWS}
      />

      <div
        ref={gridContainerRef}
        className="main-grid-scroll-area"
        style={{
          paddingLeft: HEADER_WIDTH,
          paddingTop: HEADER_HEIGHT,
        }}
      >
        <div
          className="virtual-grid-content-sizer"
          style={{
            width: TOTAL_COLS * CELL_WIDTH,
            height: TOTAL_ROWS * CELL_HEIGHT,
          }}
        >
          {visibleRows.map((row) =>
            visibleCols.map((col) => {
              const cellId = getCellId(row, col);
              const cellData = cells.get(cellId);
              const isCellEditing =
                activeCell &&
                activeCell.row === row &&
                activeCell.col === col &&
                editMode;
              const isCellActive =
                activeCell &&
                activeCell.row === row &&
                activeCell.col === col &&
                !editMode;

              return (
                <Cell
                  key={cellId}
                  row={row}
                  col={col}
                  cellData={cellData}
                  isEditing={isCellEditing}
                  isActive={isCellActive}
                  onClick={() => handleCellClick(row, col)}
                  onDoubleClick={() => handleCellDoubleClick(row, col)}
                  inputRef={isCellEditing ? inputRef : null}
                  formulaInput={formulaInput}
                  onInputChange={handleInputChange}
                  onInputBlur={handleInputBlur}
                  onInputKeyPress={handleInputKeyPress}
                  CELL_WIDTH={CELL_WIDTH}
                  CELL_HEIGHT={CELL_HEIGHT}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Grid;
