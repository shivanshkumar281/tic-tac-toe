import {
  WIN_LINES,
  applyMoveFor,
  emptyCells,
  findWinner,
  otherPlayer,
} from './engine.js';

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Find any move that immediately wins for `player`.
function winningMove(state, player) {
  for (const i of emptyCells(state.cells)) {
    const next = applyMoveFor(state, i, player);
    if (next.winner === player) return i;
  }
  return null;
}

// Heuristic board evaluation from the AI's perspective.
function evaluate(cells, ai) {
  const human = otherPlayer(ai);
  const { winner } = findWinner(cells);
  if (winner === ai) return 1000;
  if (winner === human) return -1000;

  let score = 0;
  for (const [a, b, c] of WIN_LINES) {
    const line = [cells[a], cells[b], cells[c]];
    const aiCount = line.filter((v) => v === ai).length;
    const humanCount = line.filter((v) => v === human).length;
    if (aiCount > 0 && humanCount > 0) continue; // contested line, no value
    if (aiCount === 2) score += 10;
    else if (aiCount === 1) score += 1;
    if (humanCount === 2) score -= 12; // weight defence slightly higher
    else if (humanCount === 1) score -= 1;
  }
  // Center control is valuable.
  if (cells[4] === ai) score += 3;
  else if (cells[4] === human) score -= 3;
  return score;
}

// Depth-limited minimax. The vanishing rule means games never truly "end" in a
// draw, so we cap the depth and fall back to the heuristic.
function minimax(state, depth, alpha, beta, maximizing, ai) {
  const human = otherPlayer(ai);
  if (state.winner === ai) return 1000 - (8 - depth);
  if (state.winner === human) return -1000 + (8 - depth);
  if (depth === 0) return evaluate(state.cells, ai);

  const player = maximizing ? ai : human;
  const moves = emptyCells(state.cells);

  if (maximizing) {
    let best = -Infinity;
    for (const i of moves) {
      const next = applyMoveFor(state, i, player);
      const val = minimax(next, depth - 1, alpha, beta, false, ai);
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const i of moves) {
    const next = applyMoveFor(state, i, player);
    const val = minimax(next, depth - 1, alpha, beta, true, ai);
    best = Math.min(best, val);
    beta = Math.min(beta, val);
    if (beta <= alpha) break;
  }
  return best;
}

function bestMove(state, ai, depth) {
  const moves = emptyCells(state.cells);
  let best = -Infinity;
  let choice = moves[0];
  for (const i of moves) {
    const next = applyMoveFor(state, i, ai);
    const val = minimax(next, depth - 1, -Infinity, Infinity, false, ai);
    if (val > best) {
      best = val;
      choice = i;
    }
  }
  return choice;
}

// Pick the AI's move. `difficulty` is 'easy' | 'medium' | 'hard'.
export function chooseMove(state, ai, difficulty = 'medium') {
  const moves = emptyCells(state.cells);
  if (moves.length === 0) return null;
  const human = otherPlayer(ai);

  if (difficulty === 'easy') {
    // Mostly random, with an occasional smart move so it isn't trivial.
    if (Math.random() < 0.25) {
      const win = winningMove(state, ai);
      if (win != null) return win;
    }
    return randomPick(moves);
  }

  if (difficulty === 'medium') {
    const win = winningMove(state, ai);
    if (win != null) return win;
    const block = winningMove(state, human);
    if (block != null) return block;
    if (moves.includes(4)) return 4; // prefer center
    return randomPick(moves);
  }

  // Hard: take the win, block the loss, otherwise search.
  const win = winningMove(state, ai);
  if (win != null) return win;
  const block = winningMove(state, human);
  if (block != null) return block;
  return bestMove(state, ai, 6);
}
