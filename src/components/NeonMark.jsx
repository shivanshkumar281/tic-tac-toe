// mark
export default function NeonMark({ player, fading = false }) {
  if (!player) return null;
  const cls = `mark mark-${player.toLowerCase()}${fading ? ' fading' : ''}`;

  if (player === 'X') {
    return (
      <svg className={cls} viewBox="0 0 100 100" aria-label="X">
        <line x1="22" y1="22" x2="78" y2="78" />
        <line x1="78" y1="22" x2="22" y2="78" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 100 100" aria-label="O">
      <circle cx="50" cy="50" r="28" />
    </svg>
  );
}
