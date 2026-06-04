import './scoreboard.css';

export default function Scoreboard({
  labels = { X: 'Player 1', O: 'Player 2' },
  scores,
  currentPlayer,
  winner,
}) {
  return (
    <div className="scoreboard">
      {['X', 'O'].map((p) => {
        const active = !winner && currentPlayer === p;
        const won = winner === p;
        return (
          <div
            key={p}
            className={`score-card ${p === 'X' ? 'x' : 'o'}${active ? ' active' : ''}${won ? ' won' : ''}`}
          >
            <span className="score-name">{labels[p]}</span>
            <span className="score-mark">{p}</span>
            <span className="score-value">{scores[p]}</span>
          </div>
        );
      })}
    </div>
  );
}
