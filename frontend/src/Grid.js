import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Grid = () => {
  const [grid, setGrid] = useState(Array(20).fill().map(() => Array(20).fill(0)));
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);

  const handleCellClick = (row, col) => {
    if (!start) {
      setStart([row, col]);
      const newGrid = [...grid];
      newGrid[row][col] = 1;
      setGrid(newGrid);
    } else if (!end) {
      setEnd([row, col]);
      const newGrid = [...grid];
      newGrid[row][col] = 2;
      setGrid(newGrid);
    }
  };

  const findPath = useCallback(async () => {
    if (!start || !end) return;
    try {
      const response = await axios.post('http://localhost:8080/find-path', {
        start: { x: start[1], y: start[0] },
        end: { x: end[1], y: end[0] }
      });
      setPath(response.data);
      highlightPath(response.data);
    } catch (error) {
      console.error('Error finding path:', error);
    }
  }, [start, end]);

  useEffect(() => {
    if (start && end) {
      findPath();
    }
  }, [start, end, findPath]);

  const highlightPath = (pathCoords) => {
    const newGrid = [...grid];
    pathCoords.forEach((coord) => {
      const [col, row] = [coord.x, coord.y];
      if (!(row === start[0] && col === start[1]) && !(row === end[0] && col === end[1])) {
        newGrid[row][col] = 3;
      }
    });
    setGrid(newGrid);
  };

  const resetGrid = () => {
    setGrid(Array(20).fill().map(() => Array(20).fill(0)));
    setStart(null);
    setEnd(null);
    setPath([]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-20 gap-0 border border-gray-300 w-[600px] h-[600px]">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-full h-full border border-gray-300 cursor-pointer ${
                cell === 1 ? 'bg-green-500' :
                cell === 2 ? 'bg-red-500' :
                cell === 3 ? 'bg-blue-500' : 'bg-white'
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
        onClick={resetGrid}
      >
        Reset Grid
      </button>
    </div>
  );
};

export default Grid;