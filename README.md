# Neon Tic-Tac-Toe ✨

A neon-themed twist on classic Tic-Tac-Toe, set in twinkling black space. The
board, the X/O marks, and the winning line all glow with neon light, while stars
twinkle in the background.

It comes with a clever rule change, an offline AI opponent (Easy / Medium /
Hard), and a real-time online mode where you can play a friend using a simple
6-digit room code.

---

## About the Game

This is Tic-Tac-Toe — but with a twist that keeps every match alive:

### The Twist: Vanishing Marks ♻️

Each player can only have **Three marks** on the board at once. When you place
your **fourth** mark, your **oldest** mark fades away and that square becomes
free again for either player.

- The mark that is about to vanish **pulses and dims** as a warning, so you can
  plan ahead.
- Because the board can never completely fill up, **there are no draws** —
  someone always wins eventually.

### Winning on Your Fourth Mark 🏆

There's one exception to the vanishing rule. When you place your **fourth** mark,
the game first checks whether it completes a winning line:

1. Place the fourth mark.
2. If it forms a winning pattern, **you win immediately** — your oldest mark
   **stays on the board** and is *not* removed.
3. Only if the fourth mark does **not** win does your oldest mark vanish.

So a mark that's "about to disappear" can still be part of your winning line.

### What else is in it

- 🌌 Neon visuals on an animated twinkling starfield
- 🧮 Score tracking for both players that persists across rounds and resets only
  when you refresh the page
- 🔁 A single button that switches between **Reset Game** and **New Game** after
  a win
- 🎲 A random coin-flip decides who goes first each round (offline **and** online)
- 🤖 **Offline mode** against the computer with three difficulty levels
- 🌐 **Online mode** to play a friend in real time via a room code
- 📖 A **How to Play** page

---

## Tech Stack

### Frontend
- **React** — component-based UI
- **Vite** — fast dev server and build tool
- **React Router** (HashRouter) — page navigation that works on any static host
- **CSS** — all neon glow effects (`box-shadow`, `text-shadow`, `drop-shadow`)
  and animations are pure CSS; no UI libraries
- **HTML Canvas** — the twinkling starfield is drawn and animated on a `<canvas>`
- **SVG** — the X, O, and winning line are crisp, glowing SVG shapes

### Backend (for Online play)
- **Firebase Realtime Database** — a serverless cloud database that syncs the
  game state between both players in real time. There is **no custom server** to
  run or pay for.
  - Each room is a record keyed by its 6-digit code.
  - Moves are written using **transactions**, so the server validates every move
    (right turn, empty cell, game not over) and prevents cheating or race
    conditions.
  - Both players **subscribe** to the room, so a move made by one player appears
    instantly for the other.

This combination means the whole game can be **hosted entirely for free** (a
static host like Vercel/Netlify for the app + Firebase's free tier for online).

---

## How the AI Works (Offline mode)

The offline opponent runs entirely in your browser — no server needed. It has
three difficulty levels:

| Difficulty | Strategy |
|---|---|
| **Easy** | Mostly random moves, with an occasional smart play so it isn't a pushover. |
| **Medium** | Rule-based: takes an immediate winning move, blocks your immediate winning move, otherwise prefers the center or plays randomly. |
| **Hard** | A **depth-limited minimax search** with alpha–beta pruning, plus immediate win/block detection. |

### Why the AI is special here

Classic Tic-Tac-Toe AI uses "perfect" minimax because the board eventually fills
and the game ends in a win or draw. The **vanishing-mark rule breaks that
assumption** — the board never fills, so games can go on indefinitely and there
are no draws.

To handle this, the Hard AI:
- Simulates the vanishing rule inside its search (the same engine the real game
<<<<<<< HEAD
  uses), so it understands that placing a 5th mark removes its oldest one.
=======
  uses), so it understands that placing a fourth mark removes its oldest one —
  unless that fourth mark wins, in which case the oldest mark stays and the game
  ends.
>>>>>>> 408f16c (Fixed the winning logic and updated the readme as well.)
- Searches a **limited number of moves ahead** (since the game has no natural
  end) and scores each resulting board with a **heuristic** that rewards:
  - lines where the AI has two marks and the third is open (near-wins),
  - controlling the center,
  - and penalizes the opponent's threats slightly more (so it defends well).
- Always grabs an immediate win or blocks an immediate loss before searching.

---

## How to Play

### Goal
Get **three of your marks in a row** — horizontally, vertically, or diagonally.

### Remember the twist
<<<<<<< HEAD
You can only keep **four marks** on the board. Your **fifth** move removes your
**oldest** mark (it pulses/dims first as a warning), reopening that square.
=======
You can only keep **three marks** on the board. Your **fourth** move removes your
**oldest** mark (it pulses/dims first as a warning), reopening that square —
**unless** that fourth mark completes a winning line, in which case you win and
the oldest mark stays put.
>>>>>>> 408f16c (Fixed the winning logic and updated the readme as well.)

### Scoring
- A win gives that player **+1**.
- Scores **stay** when you click **Reset Game** / **New Game**.
- Scores reset to zero **only when you refresh the page**.

### Offline Mode (vs Computer)
1. From the home screen, choose **Offline · vs Computer**.
2. Pick a difficulty: **Easy**, **Medium**, or **Hard**.
3. A coin flip decides who moves first. Play until someone wins.

### Online Mode (vs a Friend)
1. From the home screen, choose **Online · Play a Friend**.
2. One player taps **Create Room** to get a **6-digit code**.
3. Share that code with your friend.
4. Your friend taps **Join Room** and enters the code.
5. Once connected, take turns — moves sync live for both players.
6. If a player leaves, the other is notified and returned to the home screen.

---

## Run Locally

```bash
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). Offline mode works right
away. For online mode, add your Firebase credentials to a `.env` file (copy
`.env.example` and fill in the `VITE_FIREBASE_*` values from your Firebase
console), then restart the dev server.

## Build for Production

```bash
npm run build    # outputs static files to dist/
```

Deploy the `dist/` output to any free static host (Vercel, Netlify, Cloudflare
Pages, GitHub Pages). Add the `VITE_FIREBASE_*` values as environment variables
on the host so online mode works in production.

---

Developed by **Shivansh Kumar** © All rights reserved.
