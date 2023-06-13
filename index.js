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

function Node(coordinates, parentNode = null, visitedSquares = []) {
  visitedSquares.push(coordinates); //need attention
  const potentialMoves = findPotentialMoves(coordinates);
  return { coordinates, visitedSquares, parentNode, potentialMoves };
}

function knightMoves(start, finish, visitedSquares = [], moves = []) {
  //console.log("trying square: ", coordinatesToNotation(start));
  if (isSameSquare(start, finish)) {
    console.log("Already there");
    return visitedSquares;
  }
  visitedSquares.push(start);
  const potentialMoves = findPotentialMoves(start, visitedSquares);
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

//console.log(findPotentialMoves([6, 3], [[4, 4]]));

knightMoves([0, 0], [7, 7]);
