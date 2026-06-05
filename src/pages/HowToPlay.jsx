import { Link } from 'react-router-dom';
import './howto.css';

export default function HowToPlay() {
  return (
    <div className="page howto">
      <header className="game-header">
        <Link to="/" className="neon-btn ghost small">← Menu</Link>
        <h1 className="title small-title">How to Play</h1>
        <span style={{ width: 60 }} />
      </header>

      <div className="howto-card">
        <h2 className="x-glow">The Goal</h2>
        <p>
          Get three of your marks in a row — horizontally, vertically, or
          diagonally — just like classic Tic-Tac-Toe.
        </p>

        <h2 className="o-glow">The Twist: Vanishing Marks</h2>
        <p>
          Each player can only have <strong>Three marks</strong> on the board at
          once. When you place your <strong>fourth</strong> mark, your{' '}
          <strong>oldest</strong> mark fades away and that square opens up again
          for either player.
        </p>
        <p>
          Your mark that is about to vanish will <em>pulse and dim</em> so you
          can plan ahead. This means the board never fills up and there are no
          draws — someone always wins eventually!
        </p>

        <h2 className="win-glow">Winning on Your Fourth Mark</h2>
        <p>
          There's one exception to the vanishing rule. When you place your{' '}
          <strong>fourth</strong> mark, we first check if it completes a winning
          line. If it does, <strong>you win right away</strong> and your oldest
          mark <em>stays put</em> — it is not removed. The oldest mark only
          vanishes when your fourth mark <strong>doesn't</strong> win the game.
        </p>

        <h2 className="win-glow">Scoring</h2>
        <p>
          A win adds a point to that player's score. Scores stay between rounds
          when you hit <strong>Reset Game</strong> or <strong>New Game</strong>,
          and only reset to zero when you refresh the page.
        </p>

        <h2 className="x-glow">Offline Mode</h2>
        <p>
          Play against the computer. Pick <strong>Easy</strong>,{' '}
          <strong>Medium</strong>, or <strong>Hard</strong> to match your skill.
        </p>

        <h2 className="o-glow">Online Mode</h2>
        <ol>
          <li>One player taps <strong>Create Room</strong> to get a 6-digit code.</li>
          <li>Share that code with your friend.</li>
          <li>Your friend taps <strong>Join Room</strong> and enters the code.</li>
          <li>Once connected, take turns — moves sync live for both of you.</li>
        </ol>
      </div>

      <Link to="/play" className="neon-btn win" style={{ marginTop: '1.5rem' }}>
        Start Playing
      </Link>
    </div>
  );
}
