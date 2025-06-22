/**
 * src/utils/index.js
 *
 * Contains utility functions for column/row name conversions and formula evaluation.
 */

/**
 * Converts a column index (0-based) to its Excel-style column name (e.g., 0 -> A, 25 -> Z, 26 -> AA).
 * @param {number} colIndex The 0-based column index.
 * @returns {string} The Excel-style column name.
 */
export const colIndexToName = (colIndex) => {
  let name = '';
  let dividend = colIndex + 1;
  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    name = String.fromCharCode(65 + modulo) + name;
    dividend = Math.floor((dividend - modulo) / 26);
  }
  return name;
};

/**
 * Converts an Excel-style column name to its 0-based column index (e.g., A -> 0, AA -> 26).
 * @param {string} colName The Excel-style column name.
 * @returns {number} The 0-based column index.
 */
export const colNameToIndex = (colName) => {
  let index = 0;
  for (let i = 0; i < colName.length; i++) {
    index = index * 26 + (colName.charCodeAt(i) - 65 + 1);
  }
  return index - 1;
};

/**
 * Parses an Excel-style cell reference (e.g., "A1") into an object with row and column indices.
 * @param {string} ref The cell reference string (e.g., "A1").
 * @returns {{col: number, row: number}|null} An object with `col` and `row` indices, or `null` if invalid.
 */
export const parseCellRef = (ref) => {
  const match = ref.match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  const colName = match[1];
  const rowIndex = parseInt(match[2], 10) - 1;
  return { col: colNameToIndex(colName), row: rowIndex };
};

/**
 * Safely evaluates a basic arithmetic expression (supports +, -, *, /) with operator precedence.
 * This function avoids using `eval()` for security reasons.
 * @param {string} expression The arithmetic expression string.
 * @returns {number|NaN|Infinity} The result of the evaluation, NaN if invalid, or Infinity for division by zero.
 */
export const evaluateArithmeticExpression = (expression) => {
  const tokens = expression.match(/(\d+\.?\d*)|([+\-*/])/g);

  if (!tokens || tokens.length === 0) {
    return NaN;
  }

  let tempResult = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '*') {
      const num1 = parseFloat(tempResult.pop());
      const num2 = parseFloat(tokens[++i]);
      if (isNaN(num1) || isNaN(num2)) return NaN;
      tempResult.push(num1 * num2);
    } else if (token === '/') {
      const num1 = parseFloat(tempResult.pop());
      const num2 = parseFloat(tokens[++i]);
      if (isNaN(num1) || isNaN(num2)) return NaN;
      if (num2 === 0) return Infinity;
      tempResult.push(num1 / num2);
    } else {
      tempResult.push(token);
    }
  }

  let finalResult = parseFloat(tempResult[0]);
  for (let i = 1; i < tempResult.length; i += 2) {
    const operator = tempResult[i];
    const num = parseFloat(tempResult[i + 1]);
    if (isNaN(finalResult) || isNaN(num)) return NaN;

    if (operator === '+') {
      finalResult += num;
    } else if (operator === '-') {
      finalResult -= num;
    }
  }
  return finalResult;
};
