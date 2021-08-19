/// <reference path="./deployctl.d.ts" />
import { Direction, GameState, nextMove } from "./game.ts";

addEventListener("fetch", async (event: FetchEvent) => {
  event.respondWith(await handleRequest(event.request));
});

const handleRequest = async (request: Request): Promise<Response> => {
  return new Response(JSON.stringify(await buildResponseBody(request)), {
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });
};

const buildResponseBody = async (request: Request): Promise<ResponseBody> => {
  const url = new URL(request.url);
  const path = url.pathname;
  if (request.method === "GET" && path === "/") {
    return info();
  } else if (request.method === "POST" && request.body) {
    const requestBody: GameState = await request.json();
    if (path === "/start") {
      return start(requestBody);
    } else if (path === "/end") {
      return end(requestBody);
    } else if (path === "/move") {
      return move(requestBody);
    }
  }
  return dunno();
};

const info = (): InfoResponse => ({
  apiversion: "1",
  author: "jreyes33",
  color: "#4b1240",
  head: "evil",
  tail: "tiger-tail",
  version: "0.1.0",
});

const dunno = (): MessageResponse => ({ message: "dunno" });
const start = (_state: GameState): MessageResponse => ({ message: "start" });
const end = (_state: GameState): MessageResponse => ({ message: "end" });
const move = (state: GameState): MoveResponse => ({ move: nextMove(state) });

type ResponseBody = InfoResponse | MessageResponse | MoveResponse;

interface MessageResponse {
  message: string;
}

// Types based on definitions from
// https://github.com/BattlesnakeOfficial/starter-snake-typescript/blob/49e3118/src/types.d.ts
interface InfoResponse {
  apiversion: string;
  author?: string;
  color?: string;
  head?: string;
  tail?: string;
  version?: string;
}

interface MoveResponse {
  move: Direction;
  shout?: string;
}
