import { useState } from 'react';
import { Link } from 'react-router-dom';
import Board from '../components/Board.jsx';
import Scoreboard from '../components/Scoreboard.jsx';
import { useLocalGame } from '../hooks/useLocalGame.js';
import './game.css';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const LABELS = { X: 'You', O: 'Computer' };

export default function OfflineGame() {
  const [difficulty, setDifficulty] = useState('medium');
  const { game, scores, makeMove, resetBoard, fadingIndices } = useLocalGame({
    vsAI: true,
    difficulty,
    aiPlayer: 'O',
  });

  const humanTurn = !game.winner && game.currentPlayer === 'X';

  let status;
  if (game.winner === 'X') status = <span className="win">You win! 🎉</span>;
  else if (game.winner === 'O') status = <span className="win">Computer wins</span>;
  else if (humanTurn) status = <span className="x">Your turn</span>;
  else status = <span className="o">Computer thinking…</span>;

  return (
    <div className="page game-page">
      <header className="game-header">
        <Link to="/" className="neon-btn ghost small">← Menu</Link>
        <h1 className="title small-title">Tic-Tac-Toe</h1>
        <Link to="/how-to-play" className="neon-btn ghost small">Help</Link>
      </header>

      <div className="difficulty">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            className={`chip${difficulty === d ? ' active' : ''}`}
            onClick={() => setDifficulty(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <Scoreboard
        labels={LABELS}
        scores={scores}
        currentPlayer={game.currentPlayer}
        winner={game.winner}
      />

      <p className="status">{status}</p>

      <Board
        state={game}
        onCellClick={makeMove}
        disabled={!humanTurn}
        fadingIndices={fadingIndices}
      />

      <button
        className={`neon-btn ${game.winner ? 'win' : ''}`}
        onClick={resetBoard}
      >
        {game.winner ? 'New Game' : 'Reset Game'}
      </button>
    </div>
  );
}
