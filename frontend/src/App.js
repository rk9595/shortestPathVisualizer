import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const GRID_SIZE = 20;

function App() {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
  const [startTile, setStartTile] = useState(null);
  const [endTile, setEndTile] = useState(null);
  const [path, setPath] = useState([]); // Ensure path is an empty array initially

  const handleTileClick = (row, col) => {
    if (!startTile) {
      setStartTile([row, col]); // Select the start tile
    } else if (!endTile) {
      setEndTile([row, col]); // Select the end tile
      fetchPath(startTile, [row, col]); // Fetch the path once both are selected
    }
  };

  const fetchPath = async (start, end) => {
    try {
      const response = await axios.post('http://localhost:8080/find-path', {
        start: { x: start[1], y: start[0] },
        end: { x: end[1], y: end[0] }
      });
      const data = response.data;
      setPath(data); // Assuming backend returns an array of coordinates for the path
    } catch (error) {
      console.error('Error fetching path:', error);
    }
  };

  return (
    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((_, colIndex) => {
          const isStart = startTile && rowIndex === startTile[0] && colIndex === startTile[1];
          const isEnd = endTile && rowIndex === endTile[0] && colIndex === endTile[1];
          const isInPath = path.some(({ x, y }) => y === rowIndex && x === colIndex); // Highlight path

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`tile ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''} ${isInPath ? 'path' : ''}`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            />
          );
        })
      )}
    </div>
  );
}

export default App;
