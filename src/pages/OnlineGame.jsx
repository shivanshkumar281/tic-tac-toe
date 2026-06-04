import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Board from '../components/Board.jsx';
import Scoreboard from '../components/Scoreboard.jsx';
import { getFadingIndex } from '../game/engine.js';
import { isFirebaseConfigured } from '../firebase/config.js';
import {
  createRoom,
  deleteRoom,
  deserializeGame,
  getClientId,
  joinRoom,
  leaveRoom,
  newRound,
  sendMove,
  subscribeRoom,
  symbolFor,
} from '../firebase/rooms.js';
import './game.css';
import './online.css';

function Header() {
  return (
    <header className="game-header">
      <Link to="/" className="neon-btn ghost small">← Menu</Link>
      <h1 className="title small-title">Tic-Tac-Toe</h1>
      <Link to="/how-to-play" className="neon-btn ghost small">Help</Link>
    </header>
  );
}

export default function OnlineGame() {
  const me = useMemo(() => getClientId(), []);
  const navigate = useNavigate();
  const [code, setCode] = useState(null);
  const [room, setRoom] = useState(null);
  const [joinInput, setJoinInput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [opponentLeft, setOpponentLeft] = useState(false);

  useEffect(() => {
    if (!code) return;
    const unsub = subscribeRoom(code, (data) => {
      if (data?.closed && data.closed.by && data.closed.by !== symbolFor(data, me)) {
        setOpponentLeft(true);
      }
      setRoom(data);
    });
    return () => unsub();
  }, [code, me]);

  if (!isFirebaseConfigured) {
    return (
      <div className="page game-page">
        <Header />
        <div className="online-card">
          <h2 className="o-glow">Online mode needs setup</h2>
          <p>
            Online play uses a free Firebase Realtime Database. Add your
            credentials to a <code>.env</code> file (see <code>.env.example</code>{' '}
            and the README) and restart the dev server.
          </p>
          <Link to="/play" className="neon-btn">Play Offline Instead</Link>
        </div>
      </div>
    );
  }

  const handleCreate = async () => {
    setError('');
    setBusy(true);
    try {
      const newCode = await createRoom();
      setCode(newCode);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async () => {
    setError('');
    if (!/^\d{6}$/.test(joinInput)) {
      setError('Enter the 6-digit code.');
      return;
    }
    setBusy(true);
    try {
      const joined = await joinRoom(joinInput);
      setCode(joined);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const leave = () => {
    if (code) leaveRoom(code, me).catch(() => {});
    setCode(null);
    setRoom(null);
    setJoinInput('');
    setError('');
    setOpponentLeft(false);
  };

  const acknowledgeLeft = async () => {
    if (code) await deleteRoom(code).catch(() => {});
    navigate('/');
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  // left notice
  if (opponentLeft) {
    return (
      <div className="page game-page">
        <Header />
        <div className="online-card">
          <h2 className="o-glow">Opponent left</h2>
          <p>Your opponent has left the game.</p>
          <button className="neon-btn win" onClick={acknowledgeLeft}>
            Okay
          </button>
        </div>
      </div>
    );
  }

  // lobby
  if (!code) {
    return (
      <div className="page game-page">
        <Header />
        <div className="online-card">
          <h2 className="x-glow">Create a Room</h2>
          <p>Get a 6-digit code and share it with a friend.</p>
          <button className="neon-btn" onClick={handleCreate} disabled={busy}>
            {busy ? 'Creating…' : 'Create Room'}
          </button>

          <div className="divider"><span>or</span></div>

          <h2 className="o-glow">Join a Room</h2>
          <input
            className="code-input"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value.replace(/\D/g, ''))}
          />
          <button className="neon-btn" onClick={handleJoin} disabled={busy}>
            {busy ? 'Joining…' : 'Join Room'}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  // connecting
  if (!room) {
    return (
      <div className="page game-page">
        <Header />
        <div className="online-card"><p>Connecting…</p></div>
      </div>
    );
  }

  const mySymbol = symbolFor(room, me);
  const game = deserializeGame(room.game);
  const scores = room.scores || { X: 0, O: 0 };
  const waiting = room.status === 'waiting' || !room.players?.O;

  // waiting
  if (waiting) {
    return (
      <div className="page game-page">
        <Header />
        <div className="online-card">
          <h2 className="win-glow">Room Ready</h2>
          <p>Share this code with your friend:</p>
          <div className="room-code">{code}</div>
          <button className="neon-btn small" onClick={copyCode}>
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <p className="waiting-text">Waiting for an opponent to join…</p>
          <button className="neon-btn ghost" onClick={leave}>Cancel</button>
        </div>
      </div>
    );
  }

  const labels = {
    X: mySymbol === 'X' ? 'You' : 'Opponent',
    O: mySymbol === 'O' ? 'You' : 'Opponent',
  };
  const myTurn = !game.winner && game.currentPlayer === mySymbol;

  let status;
  if (game.winner) {
    status = (
      <span className="win">
        {game.winner === mySymbol ? 'You win! 🎉' : 'Opponent wins'}
      </span>
    );
  } else if (myTurn) {
    status = <span className={mySymbol === 'X' ? 'x' : 'o'}>Your turn</span>;
  } else {
    status = <span className="status-dim">Opponent's turn…</span>;
  }

  const fadingIndices = {
    X: getFadingIndex(game, 'X'),
    O: getFadingIndex(game, 'O'),
  };

  return (
    <div className="page game-page">
      <Header />
      <p className="you-are">
        You are <strong className={mySymbol === 'X' ? 'x-glow' : 'o-glow'}>{mySymbol}</strong>
        {' · '}Room <strong>{code}</strong>
      </p>

      <Scoreboard
        labels={labels}
        scores={scores}
        currentPlayer={game.currentPlayer}
        winner={game.winner}
      />

      <p className="status">{status}</p>

      <Board
        state={game}
        onCellClick={(i) => sendMove(code, i, me)}
        disabled={!myTurn}
        fadingIndices={fadingIndices}
      />

      <div className="online-actions">
        <button
          className={`neon-btn ${game.winner ? 'win' : ''}`}
          onClick={() => newRound(code)}
        >
          {game.winner ? 'New Game' : 'Reset Game'}
        </button>
        <button className="neon-btn ghost" onClick={leave}>Leave</button>
      </div>
    </div>
  );
}
