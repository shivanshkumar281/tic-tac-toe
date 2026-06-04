import {
  get,
  onValue,
  ref,
  remove,
  runTransaction,
  set,
} from 'firebase/database';
import { db } from './config.js';
import { applyMoveFor, createInitialState } from '../game/engine.js';

const randomStarter = () => (Math.random() < 0.5 ? 'X' : 'O');

// client id
export function getClientId() {
  let id = localStorage.getItem('ttt-client-id');
  if (!id) {
    id = (crypto.randomUUID?.() || `c-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem('ttt-client-id', id);
  }
  return id;
}

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// serialize
function serializeGame(state) {
  return {
    cells: state.cells.map((c) => c || '-').join(''),
    moves: { X: state.moves.X, O: state.moves.O },
    currentPlayer: state.currentPlayer,
    winner: state.winner || null,
    winningLine: state.winningLine || null,
  };
}

export function deserializeGame(g) {
  if (!g) return createInitialState('X');
  return {
    cells: g.cells.split('').map((ch) => (ch === '-' ? null : ch)),
    moves: { X: g.moves?.X || [], O: g.moves?.O || [] },
    currentPlayer: g.currentPlayer || 'X',
    winner: g.winner || null,
    winningLine: g.winningLine || null,
  };
}

// create
export async function createRoom() {
  if (!db) throw new Error('Firebase is not configured.');
  const me = getClientId();

  for (let attempt = 0; attempt < 6; attempt++) {
    const code = randomCode();
    const roomRef = ref(db, `rooms/${code}`);
    const snap = await get(roomRef);
    if (snap.exists()) continue;

    const starter = randomStarter();
    await set(roomRef, {
      createdAt: Date.now(),
      status: 'waiting',
      starter,
      players: { X: me, O: null },
      game: serializeGame(createInitialState(starter)),
      scores: { X: 0, O: 0 },
    });
    return code;
  }
  throw new Error('Could not allocate a room code. Please try again.');
}

// join
export async function joinRoom(code) {
  if (!db) throw new Error('Firebase is not configured.');
  const me = getClientId();
  const roomRef = ref(db, `rooms/${code}`);

  const snap = await get(roomRef);
  if (!snap.exists()) throw new Error('Room not found. Check the code.');

  const result = await runTransaction(roomRef, (room) => {
    if (!room) return room;
    if (room.players?.X === me || room.players?.O === me) return room;
    if (room.players?.O) return;
    room.players.O = me;
    room.status = 'playing';
    return room;
  });

  if (!result.committed || !result.snapshot.exists()) {
    throw new Error('Could not join the room.');
  }
  const room = result.snapshot.val();
  if (room.players?.X !== me && room.players?.O !== me) {
    throw new Error('Room is full.');
  }
  return code;
}

// subscribe
export function subscribeRoom(code, callback) {
  const roomRef = ref(db, `rooms/${code}`);
  return onValue(roomRef, (snap) => callback(snap.val()));
}

export function symbolFor(room, clientId) {
  if (!room?.players) return null;
  if (room.players.X === clientId) return 'X';
  if (room.players.O === clientId) return 'O';
  return null;
}

// move
export async function sendMove(code, index, clientId) {
  const roomRef = ref(db, `rooms/${code}`);
  await runTransaction(roomRef, (room) => {
    if (!room) return room;
    const symbol = symbolFor(room, clientId);
    if (!symbol) return;
    if (room.status !== 'playing') return;
    const state = deserializeGame(room.game);
    if (state.winner || state.currentPlayer !== symbol) return;
    if (state.cells[index] !== null) return;

    const next = applyMoveFor(state, index, symbol);
    room.game = serializeGame(next);
    if (next.winner) {
      room.scores = room.scores || { X: 0, O: 0 };
      room.scores[next.winner] = (room.scores[next.winner] || 0) + 1;
    }
    return room;
  });
}

// leave
export async function leaveRoom(code, clientId) {
  if (!db) return;
  const roomRef = ref(db, `rooms/${code}`);
  await runTransaction(roomRef, (room) => {
    if (!room) return room;
    const bothPresent = room.players?.X && room.players?.O;
    if (!bothPresent) return null;
    room.closed = { by: symbolFor(room, clientId) || null, at: Date.now() };
    return room;
  });
}

export async function deleteRoom(code) {
  if (!db) return;
  await remove(ref(db, `rooms/${code}`));
}

// rematch
export async function newRound(code) {
  const roomRef = ref(db, `rooms/${code}`);
  await runTransaction(roomRef, (room) => {
    if (!room) return room;
    const nextStarter = randomStarter();
    room.starter = nextStarter;
    room.game = serializeGame(createInitialState(nextStarter));
    return room;
  });
}
