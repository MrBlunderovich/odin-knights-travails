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

function newNode(coordinates, parentNode = null) {
  let visitedSquares = [];
  if (parentNode) {
    visitedSquares = [...parentNode.visitedSquares];
  }
  visitedSquares.push(coordinates);
  const potentialMoves = findPotentialMoves(coordinates, visitedSquares);
  if (potentialMoves.length === 0) {
    return;
  }
  return { coordinates, visitedSquares, parentNode, potentialMoves };
}

export async function knightMoves(start, destination) {
  if (isSameSquare(start, destination)) {
    console.log("Already there");
    return;
  }
  const queue = [newNode(start)];
  while (queue.length > 0) {
    const headOfQueue = queue[0];
    visualization.consoleLog(headOfQueue, destination);
    visualization.higlightPotential(headOfQueue);
    visualization.highlightVisited(headOfQueue);

    for (let move of headOfQueue.potentialMoves) {
      await visualization.markMove(move, 100);
      if (isSameSquare(move, destination)) {
        const solution = [...headOfQueue.visitedSquares.slice(1), move];
        console.warn("SUCCESS!", logSquares(solution));
        visualization.tracePath([...headOfQueue.visitedSquares, move]);
        return solution;
      }
    }
    for (let move of headOfQueue.potentialMoves) {
      queue.push(newNode(move, headOfQueue));
    }

    queue.shift();

    visualization.eraseVisited();
    visualization.erasePotential();
  } //end of loop
  return;
}
////////////////////////////////////////////////////////////////////////////
export function coordinatesToNotation([x, y]) {
  const ranks = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return `${ranks[x]}${y + 1}`;
}

function logSquares(array) {
  const output = array.map((square) => coordinatesToNotation(square));
  return output;
}

function isSameSquare([x1, y1], [x2, y2]) {
  if (x1 === x2 && y1 === y2) {
    return true;
  } else {
    return false;
  }
}

export function notationToPath(startNotation, finishNotation, callback) {
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

const visualization = (function () {
  async function markMove(move, milliseconds) {
    const moveDiv = document.querySelector(
      `[data-coordinates="${JSON.stringify(move)}"]`
    );
    moveDiv.classList.add("try-square");
    await delay(100);
    moveDiv.classList.remove("try-square");
  }

  function higlightPotential(node) {
    node.potentialMoves.forEach((move) => {
      const potentialDiv = document.querySelector(
        `[data-coordinates="${JSON.stringify(move)}"]`
      );
      potentialDiv.classList.add("potential-square", "observed-square");
    });
  }

  function highlightVisited(node) {
    node.visitedSquares.forEach((square) => {
      const visitedDiv = document.querySelector(
        `[data-coordinates="${JSON.stringify(square)}"]`
      );
      visitedDiv.classList.add("visited-square");
    });
  }

  function eraseVisited() {
    document.querySelectorAll(".square").forEach((square) => {
      square.classList.remove("visited-square");
    });
  }

  function erasePotential() {
    document.querySelectorAll(".square").forEach((square) => {
      square.classList.remove("potential-square");
    });
  }

  function consoleLog(node, destination) {
    console.log(
      "destination: ",
      coordinatesToNotation(destination),
      "--------------- new iteration:"
    );
    console.log(
      "visited squares: ",
      node.visitedSquares.map((square) => coordinatesToNotation(square))
    );
    console.log(
      "potential moves: ",
      node.potentialMoves.map((move) => coordinatesToNotation(move))
    );
  }

  function tracePath(arrayOfSquares) {
    const board = document.querySelector(".chessboard");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", board.clientWidth);
    svg.setAttribute("height", board.clientHeight);
    svg.setAttribute("class", "svg-line");
    //
    const arrayOfMoves = arrayOfSquares.reduce((acc, item, index, array) => {
      if (array[index - 1]) {
        acc.push([array[index - 1], item]);
        return acc;
      }
      return acc;
    }, []);
    //
    arrayOfMoves.forEach((move) => {
      const start = move[0];
      const end = move[1];
      const startSquare = document.querySelector(
        `[data-coordinates="${JSON.stringify(start)}"]`
      );
      const endSquare = document.querySelector(
        `[data-coordinates="${JSON.stringify(end)}"]`
      );
      const coordinates = {
        x1: startSquare.offsetLeft + Math.floor(startSquare.clientWidth / 2),
        y1: startSquare.offsetTop + Math.floor(startSquare.clientHeight / 2),
        x2: endSquare.offsetLeft + Math.floor(endSquare.clientWidth / 2),
        y2: endSquare.offsetTop + Math.floor(endSquare.clientHeight / 2),
      };
      const svgLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      svgLine.setAttribute("x1", coordinates.x1);
      svgLine.setAttribute("y1", coordinates.y1);
      svgLine.setAttribute("x2", coordinates.x2);
      svgLine.setAttribute("y2", coordinates.y2);
      svg.appendChild(svgLine);
    });

    board.appendChild(svg);
  }

  function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }
  return {
    markMove,
    higlightPotential,
    highlightVisited,
    eraseVisited,
    erasePotential,
    consoleLog,
    tracePath,
  };
})();
