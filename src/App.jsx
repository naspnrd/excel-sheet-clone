import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGridData } from './hooks/useGridData';
import Grid from './components/Grid';
import FormulaBar from './components/FormulaBar';
import { colIndexToName } from './utils';
import './App.css';

const App = () => {
  const TOTAL_ROWS = 10000;
  const TOTAL_COLS = 10000;
  const CELL_WIDTH = 100; // px
  const CELL_HEIGHT = 25; // px
  const HEADER_HEIGHT = 25; // px
  const HEADER_WIDTH = 50; // px for row numbers

  // Use custom hook to manage grid data and operations
  const { cells, updateCellValue, getCellId } = useGridData();

  // State for the currently active/editing cell
  const [activeCell, setActiveCell] = useState(null); // { row, col }
  const [editMode, setEditMode] = useState(false); // True if a cell is being directly edited
  const [formulaInput, setFormulaInput] = useState(''); // Value displayed in the formula bar

  const formulaBarRef = useRef(null); // Ref for the main formula bar input

  useEffect(() => {
    if (activeCell && editMode) {
      const cellData = cells.get(getCellId(activeCell.row, activeCell.col));
      setFormulaInput(cellData?.formula || cellData?.value);
    } else if (activeCell && formulaBarRef.current) {
      formulaBarRef.current.focus();
      const cellData = cells.get(getCellId(activeCell.row, activeCell.col));
      setFormulaInput(cellData?.formula || cellData?.value);
    } else {
      setFormulaInput('');
    }
  }, [activeCell, editMode, cells, getCellId]);

  const handleFormulaBarInputChange = useCallback((e) => {
    setFormulaInput(e.target.value);
  }, []);

  const handleFormulaBarBlur = useCallback(() => {
    if (activeCell) {
      updateCellValue(activeCell.row, activeCell.col, formulaInput);
    }
  }, [activeCell, formulaInput, updateCellValue]);

  const handleFormulaBarKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  }, []);

  const currentCellName = activeCell
    ? `${colIndexToName(activeCell.col)}${activeCell.row + 1}`
    : '';

  return (
    <div className="app-container">
      <FormulaBar
        currentCellName={currentCellName}
        formulaInput={formulaInput}
        onInputChange={handleFormulaBarInputChange}
        onInputBlur={handleFormulaBarBlur}
        onInputKeyPress={handleFormulaBarKeyPress}
        formulaBarRef={formulaBarRef}
      />

      <Grid
        TOTAL_ROWS={TOTAL_ROWS}
        TOTAL_COLS={TOTAL_COLS}
        CELL_WIDTH={CELL_WIDTH}
        CELL_HEIGHT={CELL_HEIGHT}
        HEADER_WIDTH={HEADER_WIDTH}
        HEADER_HEIGHT={HEADER_HEIGHT}
        cells={cells}
        updateCellValue={updateCellValue}
        getCellId={getCellId}
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        editMode={editMode}
        setEditMode={setEditMode}
        formulaInput={formulaInput}
        setFormulaInput={setFormulaInput}
      />
    </div>
  );
};

export default App;
