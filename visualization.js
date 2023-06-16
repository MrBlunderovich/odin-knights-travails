export default function Visualize() {
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
  function erasePath() {
    const board = document.querySelector(".chessboard");
    const path = document.querySelector(".svg-line");
    board.removeChild(path);
  }

  function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }

  function coordinatesToNotation([x, y]) {
    const ranks = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return `${ranks[x]}${y + 1}`;
  }

  return {
    markMove,
    higlightPotential,
    highlightVisited,
    eraseVisited,
    erasePotential,
    consoleLog,
    tracePath,
    erasePath,
  };
}
