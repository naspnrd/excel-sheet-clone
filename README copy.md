# Excel Sheet Clone (Frontend Only)

This project is a performant, frontend-only clone of a basic Excel spreadsheet. It features a large virtualized grid, editable cells, and real-time formula-based calculations.

## Objectives & Deliverables

1.  **Sheet Rendering**: Renders a 10,000x10,000 cell grid without freezing or crashing the browser, utilizing virtualization for performance.
2.  **Editable Cells**: All cells are editable, allowing users to input values or formulas by clicking or double-clicking.
3.  **Formula Parsing & Calculation**: Supports basic mathematical operations (`+`, `-`, `*`, `/`) with cell references (e.g., `=A1+B1`). Formulas auto-update in real-time when dependencies change.
4.  **UI/UX**: Features a clean, minimal interface with labeled rows and columns, a scrollable interface, and sticky headers.

## Features

- **Massive Grid Support**: Efficiently renders a 10,000x10,000 cell (100,000,000 cells) grid using UI virtualization.
- **Editable Cells**: Click to select, double-click to edit, or type directly into the formula bar.
- **Basic Formula Engine**:
  - Supports `+`, `-`, `*`, `/` operations.
  - Handles cell references (e.g., `=A1+B1`).
  - Real-time updates: Changes in dependent cells trigger automatic recalculations.
  - Basic circular reference detection (`#CIRCULAR!`).
  - Basic division by zero handling (`#DIV/0!`).
  - Error handling for invalid formulas (`#ERROR!`).
- **Intuitive UI**:
  - Numbered rows and lettered columns (A, B, ..., Z, AA, AB, ... JJJ).
  - Sticky row and column headers that stay in view while scrolling.
  - Clear visual feedback for active and editing cells.
  - Formula bar displays the content of the active cell (value or formula).

## Setup and Run Instructions

This project is a standard React application created with `create-react-app`.

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

1.  **Clone the repository (or create project files manually):**

    If you're creating files manually, ensure your directory structure matches the "Project Structure" section above.

2.  **Navigate to the project directory:**

    ```bash
    cd excel-sheet-clone
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

To start the development server:

```bash
npm start
# or
yarn start
```
