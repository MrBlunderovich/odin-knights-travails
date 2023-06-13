//

function findPotentialMoves([x, y], visitedSquares = []) {
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
  logSquares(candidateMoves);

  const potentialMoves = candidateMoves.filter((square) => {
    return notYetVisited(square);
  });
  logSquares(potentialMoves);
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
}

//#################################################################

function MoveNode(coordinates, visitedSquares = []) {
  visitedSquares.push(coordinates); //need attention
  return { coordinates, visitedSquares, potentialMoves };
}

function knightMoves(start, finish) {
  const queue = [MoveNode(start)];
}

function coordinatesToSquare([x, y]) {
  const ranks = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return `${ranks[x]}${y + 1}`;
}

function logSquares(array) {
  const output = array.map((square) => coordinatesToSquare(square));
  console.log(output);
  return output;
}

console.log(findPotentialMoves([6, 3], [[4, 4]]));
