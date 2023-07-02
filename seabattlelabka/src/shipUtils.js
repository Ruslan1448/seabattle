export const generateRandomShips = () => {
    const newCells = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => false));

    const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]; // настройки
    const directions = ['horizontal', 'vertical']; 

    for (const shipSize of shipSizes) {
      let shipPlaced = false;

      while (!shipPlaced) {
        const rowIndex = Math.floor(Math.random() * 10);
        const colIndex = Math.floor(Math.random() * 10);
        const direction = directions[Math.floor(Math.random() * 2)];

        if (canPlaceShip(rowIndex, colIndex, direction, shipSize, newCells)) {
          placeShip(rowIndex, colIndex, direction, shipSize, newCells);
          shipPlaced = true;
          console.log('generating');
        }
      }
    }

    console.table(newCells)

    const cells = Array.from({ length: 10 }, () => new Array(10));
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
      cells[i][j] = { clicked: false, hasShip: newCells[i][j] };
      }    
    }

    return cells;
  };

  const canPlaceShip = (rowIndex, colIndex, direction, shipSize, newCells) => {
    if (direction === 'horizontal') {
      if (colIndex + shipSize > 10) {
        return false;
      }

      for (let i = colIndex; i < colIndex + shipSize; i++) {
        if (newCells[rowIndex][i] || hasAdjacentShip(rowIndex, i, newCells)) {
          return false;
        }
      }
    } else if (direction === 'vertical') {
      if (rowIndex + shipSize > 10) {
        return false;
      }

      for (let i = rowIndex; i < rowIndex + shipSize; i++) {
        if (newCells[i][colIndex] || hasAdjacentShip(i, colIndex, newCells)) {
          return false;
        }
      }
    }

    return true;
  };

  const placeShip = (rowIndex, colIndex, direction, shipSize, newCells) => {
    if (direction === 'horizontal') {
      for (let i = colIndex; i < colIndex + shipSize; i++) {
        newCells[rowIndex][i] = true;
      }
    } else if (direction === 'vertical') {
      for (let i = rowIndex; i < rowIndex + shipSize; i++) {
        newCells[i][colIndex] = true;
      }
    }
  };

  const hasAdjacentShip = (rowIndex, colIndex, cells) => {
    const adjacentCoordinates = [
      { row: rowIndex - 1, col: colIndex }, 
      { row: rowIndex + 1, col: colIndex }, 
      { row: rowIndex, col: colIndex - 1 }, 
      { row: rowIndex, col: colIndex + 1 }, 
    ];

    for (const coord of adjacentCoordinates) {
      const { row, col } = coord;

      if (row >= 0 && row < 10 && col >= 0 && col < 10 && cells[row][col]) {
        return true;
      }
    }

    return false;
  };
