// lines & limits
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

export const MAX_MARKS = 3;

// state
export function createInitialState(startingPlayer = 'X') {
  return {
    cells: Array(9).fill(null),
    moves: { X: [], O: [] },
    currentPlayer: startingPlayer,
    winner: null,
    winningLine: null,
  };
}

// win check
export function findWinner(cells) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line };
    }
  }
  return { winner: null, line: null };
}

export function getFadingIndex(state, player) {
  if (state.winner) return null;
  const queue = state.moves[player];
  return queue.length >= MAX_MARKS ? queue[0] : null;
}

// moves
export function applyMoveFor(state, index, player) {
  if (state.winner) return state;
  if (index == null || index < 0 || index > 8) return state;
  if (state.cells[index] !== null) return state;

  const cells = state.cells.slice();
  const queue = state.moves[player].slice();

  cells[index] = player;
  queue.push(index);

  // Check for a win with the newly placed mark still on the board.
  const { winner, line } = findWinner(cells);

  // Only remove the oldest mark if placing this mark did not win the game.
  if (!winner && queue.length > MAX_MARKS) {
    const oldest = queue.shift();
    cells[oldest] = null;
  }

  const moves = { ...state.moves, [player]: queue };

  return {
    cells,
    moves,
    currentPlayer: player === 'X' ? 'O' : 'X',
    winner,
    winningLine: line,
  };
}

export function applyMove(state, index) {
  return applyMoveFor(state, index, state.currentPlayer);
}

// helpers
export function emptyCells(cells) {
  const out = [];
  for (let i = 0; i < 9; i++) if (cells[i] === null) out.push(i);
  return out;
}

export const otherPlayer = (p) => (p === 'X' ? 'O' : 'X');
