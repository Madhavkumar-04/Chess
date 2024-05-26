import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

//  todo : code repeatation
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();
  const [ches, setChess] = useState(new Chess());
  const [board, setBoard] = useState(ches.board());
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const messege = JSON.parse(event.data);
      switch (messege.type) {
        case INIT_GAME:
          setBoard(ches.board());
          setStarted(true);
          console.log(ches.board());
          console.log("Game Initialized");
          break;
        case MOVE:
          const move = messege.payload;
          ches.move(move);

          setBoard(ches.board());
          console.log(ches.board());
          console.log("move made");
          break;
        case GAME_OVER:
          console.log("game over");
          break;
      }
    };
  }, [socket]);
  if (!socket) return <div>Connecting......</div>;
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 bg-red-200 w-full flex justify-center ">
            <ChessBoard
              chess={ches}
              setBoard={setBoard}
              socket={socket}
              board={board}
            />
          </div>
          <div className="col-span-2 bg-slate-800 w-full h-full flex justify-center">
            <div className="pt-8">
              {!started && (
                <Button
                  onClick={() => {
                    socket.send(
                      JSON.stringify({
                        type: INIT_GAME,
                      })
                    );
                  }}
                >
                  Play
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
