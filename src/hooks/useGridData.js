import { useState, useEffect, useRef, useCallback } from 'react';
import {
  colIndexToName,
  colNameToIndex,
  parseCellRef,
  evaluateArithmeticExpression,
} from '../utils';

/**
 * Custom hook to manage cell data, dependencies, and calculation logic.
 * It provides the `cells` map and a function to update cell values,
 * triggering re-calculations for dependent cells.
 */
export const useGridData = () => {
  const [cells, setCells] = useState(new Map());
  const dependencies = useRef(new Map());
  const reverseDependencies = useRef(new Map());
  const cellsRef = useRef(cells);

  useEffect(() => {
    cellsRef.current = cells;
  }, [cells]);

  const getCellId = useCallback((row, col) => `R${row}C${col}`, []);

  const evaluateCell = useCallback(
    (cellId, evaluatingCells = new Set()) => {
      if (evaluatingCells.has(cellId)) {
        console.error(`Circular reference detected: ${cellId}`);
        return '#CIRCULAR!';
      }
      evaluatingCells.add(cellId);

      const cellData = cellsRef.current.get(cellId);
      if (!cellData || !cellData.formula) {
        evaluatingCells.delete(cellId);
        return cellData?.value || '';
      }

      let expression = cellData.formula.substring(1);

      const currentCellDependencies = new Set();
      expression = expression.replace(/([A-Z]+[0-9]+)/g, (match) => {
        const ref = parseCellRef(match);
        if (ref) {
          const refCellId = getCellId(ref.row, ref.col);
          currentCellDependencies.add(refCellId);
          const refValue = evaluateCell(refCellId, evaluatingCells);
          const parsedRefValue = parseFloat(refValue);
          return isNaN(parsedRefValue) ? 0 : parsedRefValue;
        }
        return match;
      });

      const oldDeps = dependencies.current.get(cellId);
      if (oldDeps) {
        oldDeps.forEach((depId) => {
          const reverse = reverseDependencies.current.get(depId);
          if (reverse) reverse.delete(cellId);
        });
      }
      dependencies.current.set(cellId, currentCellDependencies);
      currentCellDependencies.forEach((depId) => {
        if (!reverseDependencies.current.has(depId)) {
          reverseDependencies.current.set(depId, new Set());
        }
        reverseDependencies.current.get(depId).add(cellId);
      });

      let result;
      try {
        result = evaluateArithmeticExpression(expression);
        if (isNaN(result)) {
          result = '#ERROR!';
        } else if (!isFinite(result)) {
          result = '#DIV/0!';
        }
      } catch (e) {
        result = '#ERROR!';
      }

      evaluatingCells.delete(cellId);
      return result.toString();
    },
    [getCellId]
  );

  const recalculateCellAndDependents = useCallback(
    (cellId, currentCellsSnapshot) => {
      const stack = [cellId];
      const visited = new Set();
      const cellsToUpdate = new Set();

      while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current)) continue;
        visited.add(current);
        cellsToUpdate.add(current);

        const dependents = reverseDependencies.current.get(current);
        if (dependents) {
          dependents.forEach((dep) => {
            if (!visited.has(dep)) stack.push(dep);
          });
        }
      }

      const updatedCells = new Map(currentCellsSnapshot);
      const currentCellsBackup = cellsRef.current;
      cellsRef.current = updatedCells;

      try {
        cellsToUpdate.forEach((cId) => {
          const cellData = updatedCells.get(cId);
          if (cellData && cellData.formula) {
            const newDisplayValue = evaluateCell(cId);
            if (newDisplayValue !== cellData.displayValue) {
              updatedCells.set(cId, {
                ...cellData,
                displayValue: newDisplayValue,
              });
            }
          }
        });
      } finally {
        cellsRef.current = currentCellsBackup;
      }

      return updatedCells;
    },
    [evaluateCell]
  );

  const updateCellValue = useCallback(
    (row, col, newValue) => {
      const cellId = getCellId(row, col);
      let newCellData = { value: newValue, displayValue: newValue };

      if (newValue.startsWith('=')) {
        newCellData.formula = newValue;
        const currentCellsBackup = cellsRef.current;
        cellsRef.current = new Map(cellsRef.current);
        cellsRef.current.set(cellId, newCellData);
        try {
          newCellData.displayValue = evaluateCell(cellId);
        } finally {
          cellsRef.current = currentCellsBackup;
        }
      } else {
        const existingCell = cellsRef.current.get(cellId);
        if (existingCell && existingCell.formula) {
          const oldDeps = dependencies.current.get(cellId);
          if (oldDeps) {
            oldDeps.forEach((depId) => {
              const reverse = reverseDependencies.current.get(depId);
              if (reverse) reverse.delete(cellId);
            });
            dependencies.current.delete(cellId);
          }
        }
      }

      const updatedCells = new Map(cellsRef.current);
      updatedCells.set(cellId, newCellData);
      const finalCells = recalculateCellAndDependents(cellId, updatedCells);
      setCells(finalCells);
    },
    [getCellId, evaluateCell, recalculateCellAndDependents]
  );

  return { cells, updateCellValue, getCellId };
};
