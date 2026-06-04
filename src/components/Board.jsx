import NeonMark from './NeonMark.jsx';
import './board.css';

// line coords
function center(i) {
  const row = Math.floor(i / 3);
  const col = i % 3;
  return { x: ((col + 0.5) / 3) * 100, y: ((row + 0.5) / 3) * 100 };
}

export default function Board({ state, onCellClick, disabled, fadingIndices = {} }) {
  const { cells, winningLine } = state;
  const fadeSet = new Set(
    [fadingIndices.X, fadingIndices.O].filter((v) => v != null)
  );

  return (
    <div className={`board${winningLine ? ' has-winner' : ''}`}>
      <div className="grid">
        {cells.map((value, i) => (
          <button
            key={i}
            className="cell"
            onClick={() => onCellClick(i)}
            disabled={disabled || value !== null || !!state.winner}
            aria-label={`Cell ${i + 1}${value ? `, ${value}` : ', empty'}`}
          >
            <NeonMark player={value} fading={fadeSet.has(i)} />
          </button>
        ))}
      </div>

      {winningLine && (
        <svg className="win-line" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line
            x1={center(winningLine[0]).x}
            y1={center(winningLine[0]).y}
            x2={center(winningLine[2]).x}
            y2={center(winningLine[2]).y}
          />
        </svg>
      )}
    </div>
  );
}
