// Types based on definitions from
// https://github.com/BattlesnakeOfficial/starter-snake-typescript/blob/49e3118/src/types.d.ts
interface Game {
  id: string;
  ruleset: { name: string; version: string };
  timeout: number;
}

interface Coord {
  x: number;
  y: number;
}

interface Battlesnake {
  id: string;
  name: string;
  health: number;
  body: Coord[];
  latency: string;
  head: Coord;
  length: number;
}

interface Board {
  height: number;
  width: number;
  food: Coord[];
  snakes: Battlesnake[];
}

export interface GameState {
  game: Game;
  turn: number;
  board: Board;
  you: Battlesnake;
}

const DIRECTIONS = ["up", "down", "left", "right"] as const;
export type Direction = typeof DIRECTIONS[number];

export const nextMove = (gameState: GameState): Direction => {
  const { height, width, snakes } = gameState.board;
  const { head } = gameState.you;
  const target = gameState.board.food[0];
  const allowed = new Set(DIRECTIONS);
  const blocked = snakes.flatMap((s) => s.body);
  DIRECTIONS.forEach((dir) => {
    const next = nextCoord(dir, head);
    const { x, y } = next;
    if (
      x < 0 || x >= width || y < 0 || y >= height || hasCoord(next, blocked)
    ) {
      allowed.delete(dir);
    }
  });
  if (target.x > head.x && allowed.has("right")) {
    return "right";
  } else if (target.x < head.x && allowed.has("left")) {
    return "left";
  } else if (target.y > head.y && allowed.has("up")) {
    return "up";
  } else if (allowed.has("down")) {
    return "down";
  }
  return allowed.values().next().value ?? "up";
};

const nextCoord = (dir: Direction, { x, y }: Coord): Coord => {
  switch (dir) {
    case "up":
      return { x, y: y + 1 };
    case "down":
      return { x, y: y - 1 };
    case "left":
      return { x: x - 1, y };
    case "right":
      return { x: x + 1, y };
  }
};

const hasCoord = ({ x, y }: Coord, coords: Coord[]): boolean =>
  coords.some((c) => c.x === x && c.y === y);
