//

function findPotentialMoves(coordinates, visitedSquares = []) {
  const [x, y] = coordinates;
  const BOARD_SIZE = 7;
  const candidateMoves = [
    [x + 2, y + 1],
    [x + 2, y - 1],
    [x - 2, y + 1],
    [x - 2, y - 1],
    [x + 1, y + 2],
    [x + 1, y - 2],
    [x - 1, y + 2],
    [x - 1, y - 2],
  ].filter((square) => squareIsInsideBoard(square));
  //logSquares(candidateMoves);

  const potentialMoves = candidateMoves.filter((square) => {
    return notYetVisited(square);
  });
  //logSquares(potentialMoves);
  return potentialMoves;

  ////////////////////////////////////////////////////////////////

  function notYetVisited([x, y]) {
    for (let square of visitedSquares) {
      if (square[0] === x && square[1] === y) {
        //console.log(coordinatesToSquare(square), " visited!");
        return false;
      }
    }
    return true;
  }

  function squareIsInsideBoard([x, y]) {
    if (x < 0 || y < 0 || x > BOARD_SIZE || y > BOARD_SIZE) {
      return false;
    }
    return true;
  }
} //################################# END OF findPotentialMoves FUNCTION

function knightMoves(start, finish, visitedSquares = [], moves = []) {
  if (moves.length === 0) {
    console.log(
      `start: ${coordinatesToNotation(start)}; finish: ${coordinatesToNotation(
        finish
      )}`
    );
  }
  //console.log("trying square: ", coordinatesToNotation(start));
  if (isSameSquare(start, finish)) {
    console.log("Already there");
    return visitedSquares;
  }
  visitedSquares.push(start);
  const potentialMoves = findPotentialMoves(start, visitedSquares);
  console.log(
    potentialMoves.map((cell) => coordinatesToNotation(cell)).join(", ")
  );
  if (visitedSquares.length > 64) {
    console.warn("Too many moves");
    return visitedSquares;
  }
  for (let move of potentialMoves) {
    console.log("trying square: ", coordinatesToNotation(move));
    if (isSameSquare(move, finish)) {
      moves.push(move);
      console.log("SUCCESS!", logSquares(moves));
      return visitedSquares;
    }
  }
  for (let move of potentialMoves) {
    moves.push(move);
    const resolution = knightMoves(move, finish, visitedSquares, moves);
    if (resolution) {
      return resolution;
    }
  }
  return false;
}
/////////////////////////////////// ANOTHER TRY

function Node(coordinates, parentNode = null, visitedSquares = []) {
  visitedSquares.push(coordinates); //need attention
  const potentialMoves = findPotentialMoves(coordinates);
  return { coordinates, visitedSquares, parentNode, potentialMoves };
}

function knightMovesTree(start, destination) {
  const queue = [Node(start)];
  while (queue.length > 0) {
    const headOfQueue = queue[0];
    //-------------------------------------------------------------
    console.log("destination: ", coordinatesToNotation(destination));
    console.log(
      "queue: ",
      queue.map((node) => coordinatesToNotation(node.coordinates))
    );
    console.log(
      "potential moves: ",
      headOfQueue.potentialMoves.map((move) => coordinatesToNotation(move))
    );
    //-------------------------------------------------------------

    queue.shift();
  } //end of loop
  return;
}

function coordinatesToNotation([x, y]) {
  const ranks = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return `${ranks[x]}${y + 1}`;
}

function logSquares(array) {
  const output = array.map((square) => coordinatesToNotation(square));
  //console.log(output);
  return output;
}

function isSameSquare([x1, y1], [x2, y2]) {
  if (x1 === x2 && y1 === y2) {
    return true;
  } else {
    return false;
  }
}

function notationToPath(startNotation, finishNotation, callback) {
  for (let squareNotation of [startNotation, finishNotation]) {
    if (
      !squareNotation ||
      !typeof squareNotation === "string" ||
      squareNotation.length !== 2
    ) {
      console.error("Invalid square input");
      return;
    }
  }

  const ranks = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const startX = ranks.indexOf(startNotation[0]);
  const startY = startNotation[1] - 1;
  const finishX = ranks.indexOf(finishNotation[0]);
  const finishY = finishNotation[1] - 1;
  callback([startX, startY], [finishX, finishY]);
}

//console.log(findPotentialMoves([6, 3], [[4, 4]]));

//knightMoves([0, 0], [7, 7]);
//knightMoves([4, 5], [2, 3]);

//notationToPath("a1", "h8", knightMoves);
//notationToPath("e6", "c4", knightMoves);

notationToPath("e6", "c4", knightMovesTree);
