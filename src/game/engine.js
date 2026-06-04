// Core game logic for "Vanishing" Tic-Tac-Toe.
// Each player may have at most 4 marks on the board at once. Placing a 5th
// mark removes that player's oldest mark, so the board never fully fills and
// there are no draws.

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const MAX_MARKS = 4;

export function createInitialState(startingPlayer = 'X') {
  return {
    cells: Array(9).fill(null),
    moves: { X: [], O: [] },
    currentPlayer: startingPlayer,
    winner: null,
    winningLine: null,
  };
}

export function findWinner(cells) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line };
    }
  }
  return { winner: null, line: null };
}

// Returns the index that will vanish if `player` plays again, or null.
// Once the game is won nothing fades, so the winning marks stay fully lit.
export function getFadingIndex(state, player) {
  if (state.winner) return null;
  const queue = state.moves[player];
  return queue.length >= MAX_MARKS ? queue[0] : null;
}

// Apply a move for a specific player (does not require it to be their turn).
// Returns a new state, or the same state if the move is illegal.
export function applyMoveFor(state, index, player) {
  if (state.winner) return state;
  if (index == null || index < 0 || index > 8) return state;
  if (state.cells[index] !== null) return state;

  const cells = state.cells.slice();
  const queue = state.moves[player].slice();

  cells[index] = player;
  queue.push(index);

  if (queue.length > MAX_MARKS) {
    const oldest = queue.shift();
    cells[oldest] = null;
  }

  const moves = { ...state.moves, [player]: queue };
  const { winner, line } = findWinner(cells);

  return {
    cells,
    moves,
    currentPlayer: player === 'X' ? 'O' : 'X',
    winner,
    winningLine: line,
  };
}

// Apply a move for whoever's turn it currently is.
export function applyMove(state, index) {
  return applyMoveFor(state, index, state.currentPlayer);
}

export function emptyCells(cells) {
  const out = [];
  for (let i = 0; i < 9; i++) if (cells[i] === null) out.push(i);
  return out;
}

export const otherPlayer = (p) => (p === 'X' ? 'O' : 'X');
