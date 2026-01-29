import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every(Boolean);
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // A classic, minimal "time travel" history (like the React tutorial)
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepIndex, setStepIndex] = useState(0);

  const currentSquares = history[stepIndex];

  const winnerInfo = useMemo(
    () => calculateWinner(currentSquares),
    [currentSquares]
  );

  const xIsNext = stepIndex % 2 === 0;
  const nextPlayer = xIsNext ? 'X' : 'O';
  const isDraw = !winnerInfo && isBoardFull(currentSquares);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const statusText = useMemo(() => {
    if (winnerInfo?.winner) return `Winner: ${winnerInfo.winner}`;
    if (isDraw) return 'Draw game';
    return `Next player: ${nextPlayer}`;
  }, [winnerInfo, isDraw, nextPlayer]);

  const handleSquareClick = index => {
    // Ignore clicks if game already finished or square already filled
    if (winnerInfo || currentSquares[index]) return;

    const nextSquares = currentSquares.slice();
    nextSquares[index] = nextPlayer;

    // If user time-traveled and then plays, we must discard "future" history.
    const nextHistory = history.slice(0, stepIndex + 1);
    setHistory([...nextHistory, nextSquares]);
    setStepIndex(nextHistory.length);
  };

  const handleReset = () => {
    setHistory([Array(9).fill(null)]);
    setStepIndex(0);
  };

  const handleJumpTo = moveIndex => {
    setStepIndex(moveIndex);
  };

  const moves = history.map((_, move) => {
    const description = move === 0 ? 'Go to start' : `Go to move #${move}`;
    const isCurrent = move === stepIndex;

    return (
      <li key={move}>
        <button
          type="button"
          className={`btn btn-ghost ${isCurrent ? 'is-active' : ''}`}
          onClick={() => handleJumpTo(move)}
          aria-current={isCurrent ? 'step' : undefined}
        >
          {description}
        </button>
      </li>
    );
  });

  const winningLineSet = useMemo(() => {
    const line = winnerInfo?.line ?? [];
    return new Set(line);
  }, [winnerInfo]);

  return (
    <div className="App">
      <header className="topbar">
        <div className="brand">
          <div className="brand-badge" aria-hidden="true">
            TTT
          </div>
          <div className="brand-text">
            <div className="brand-title">Tic Tac Toe</div>
            <div className="brand-subtitle">Two-player classic</div>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            type="button"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </header>

      <main className="page">
        <section className="card">
          <div className="card-header">
            <div className="status" role="status" aria-live="polite">
              {statusText}
            </div>

            <div className="controls">
              <button type="button" className="btn btn-primary" onClick={handleReset}>
                New game
              </button>
            </div>
          </div>

          <div className="card-body">
            <div className="board" role="grid" aria-label="Tic Tac Toe board">
              {currentSquares.map((value, idx) => {
                const isWinning = winningLineSet.has(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`square ${isWinning ? 'is-winning' : ''}`}
                    onClick={() => handleSquareClick(idx)}
                    role="gridcell"
                    aria-label={`Square ${idx + 1}${value ? `, ${value}` : ''}`}
                  >
                    <span className={`mark ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''}`}>
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>

            <aside className="sidebar" aria-label="Game history">
              <div className="sidebar-title">History</div>
              <ol className="moves">{moves}</ol>
            </aside>
          </div>

          <div className="card-footer">
            <div className="hint">
              Tip: Click a square to play. Use history to jump to earlier moves.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
