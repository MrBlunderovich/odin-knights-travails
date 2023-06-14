import { knightMoves, notationToPath } from "./knightMoves.js";

notationToPath("e6", "c4", knightMoves);
notationToPath("e6", "f4", knightMoves);
notationToPath("a1", "h7", knightMoves);

const chessboard = document.querySelector(".chessboard");
