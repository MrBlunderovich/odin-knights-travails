import {
  knightMoves,
  notationToPath,
  coordinatesToNotation,
} from "./knightMoves.js";

/* notationToPath("e6", "c4", knightMoves);
notationToPath("e6", "f4", knightMoves);
notationToPath("a1", "h7", knightMoves); */

/* const chessboard = (function () {
  const board = [];
  for (let rank = 0; rank < 8; rank++) {
    const newRank = [];
    for (let file = 0; file < 8; file++) {
      newRank.push([rank, file]);
      //newRank.push(`${rank}:${file}`);
    }
    board.push(newRank);
  }
  return board;
})(); */
const chessboard = (function () {
  const board = [];
  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      board.push([file, rank]);
    }
  }
  return board;
})();

//console.log(chessboard);

const container = document.querySelector(".chessboard");

function drawChessboard(source, container) {
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  source.forEach((square) => {
    const newElement = document.createElement("div");
    newElement.classList.add("square");
    if ((square[0] + square[1]) % 2 === 0) {
      newElement.classList.add("dark");
    }
    //newElement.textContent = coordinatesToNotation(square);
    newElement.dataset.name = coordinatesToNotation(square);
    newElement.dataset.coordinates = JSON.stringify(square);

    fragment.appendChild(newElement);
  });
  container.appendChild(fragment);
}

drawChessboard(chessboard, container);

document.addEventListener("click", handleClick);

let searchInProgress = false;
let startSquare = null;
let destinationSquare = null;

function handleClick(event) {
  if (searchInProgress) {
    location.reload();
  }
  if (event.target.matches(".square")) {
    if (searchInProgress) {
      return;
    }
    if (startSquare === null) {
      startSquare = JSON.parse(event.target.dataset.coordinates);
      event.target.classList.add("start-square");
      return;
    }
    if (destinationSquare === null) {
      destinationSquare = JSON.parse(event.target.dataset.coordinates);
      event.target.classList.add("destination-square");
      searchInProgress = true;
      knightMoves(startSquare, destinationSquare);
    }
  }
}
