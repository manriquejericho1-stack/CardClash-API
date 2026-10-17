# CardClash API

Backend API for **CardClash**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Jericho Manrique (manriquejericho1-stack), BSCS [3-2]
- Group and game concept: [Group2 - CardClash]

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## What "completed" means in my game

A player is considered to have completed the game when their final game result has a status of `COMPLETED`. Players who leave early or do not finish the game are not considered completed.

## Tables

1. `users` — Stores player and host accounts.
2. `question_sets` — Stores sets of questions used in games.
3. `power_cards` — Stores the available power cards and their effects.
4. `questions` — Stores questions belonging to question sets.
5. `game_sessions` — Stores game sessions, join codes, modes, and game status.
6. `seat` — Stores the seats assigned to users in a game session.
7. `players` — Stores players participating in a game session.
8. `participants` — Stores the game participants, their score, HP, and status.
9. `choices` — Stores the answer choices for questions.
10. `question_cards` — Stores question cards and their point values.
11. `decks` — Stores the card decks assigned to participants.
12. `participant_members` — Links players to their game participants.
13. `cards` — Stores cards belonging to participant decks.
14. `participant_power_cards` — Stores power cards acquired by participants.
15. `answers` — Stores player answers, correctness, points earned, and HP changes.
16. `aid_requests` — Stores requests for assistance between participants.
17. `revivals` — Stores revival attempts and their results.
18. `comeback_challenges` — Stores challenges created during revival/comeback situations.
19. `comeback_cards` — Stores the question cards used in comeback challenges.
20. `game_results` — Stores the final results of participants after a game ends.

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
