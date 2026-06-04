import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyMove,
  createInitialState,
  getFadingIndex,
} from '../game/engine.js';
import { chooseMove } from '../game/ai.js';

const randomStarter = () => (Math.random() < 0.5 ? 'X' : 'O');

// Manages a locally-played game (hot-seat or vs computer), including scores
// that persist across resets but reset on page refresh. Who plays first is
// chosen at random on load and on every new game.
export function useLocalGame({ vsAI = false, difficulty = 'medium', aiPlayer = 'O' } = {}) {
  const [game, setGame] = useState(() => createInitialState(randomStarter()));
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const countedRef = useRef(false);
  const aiTimer = useRef(null);

  // Tally a win exactly once per round.
  useEffect(() => {
    if (game.winner && !countedRef.current) {
      countedRef.current = true;
      setScores((s) => ({ ...s, [game.winner]: s[game.winner] + 1 }));
    }
  }, [game.winner]);

  const makeMove = useCallback(
    (index) => {
      setGame((prev) => applyMove(prev, index));
    },
    []
  );

  // Computer move.
  useEffect(() => {
    if (!vsAI || game.winner) return;
    if (game.currentPlayer !== aiPlayer) return;
    aiTimer.current = setTimeout(() => {
      setGame((prev) => {
        if (prev.winner || prev.currentPlayer !== aiPlayer) return prev;
        const move = chooseMove(prev, aiPlayer, difficulty);
        return move == null ? prev : applyMove(prev, move);
      });
    }, 480);
    return () => clearTimeout(aiTimer.current);
  }, [vsAI, aiPlayer, difficulty, game.currentPlayer, game.winner, game.cells]);

  // Reset the board only (keep scores). The first turn is randomised.
  const resetBoard = useCallback(() => {
    countedRef.current = false;
    setGame(createInitialState(randomStarter()));
  }, []);

  const fadingIndices = {
    X: getFadingIndex(game, 'X'),
    O: getFadingIndex(game, 'O'),
  };

  return { game, scores, makeMove, resetBoard, fadingIndices };
}
