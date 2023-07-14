import { useState } from "react";
export function Square({ number, value, handleClick, winArray }) {
  let squareClass = "square"
  if (winArray) {

    for (let i of winArray) {
      if (i === number) {
        console.log(i === value)
        squareClass += " winSquare"
      }
    }
  }
  return <button className={squareClass} onClick={handleClick}>{value}</button>;
}
export function Board({ isXNext, squares, onPlay }) {

  const { winner, index } = calculateWinner(squares)

  const boardRowLength = 3
  const board = []
  for (let i = 0; i < boardRowLength; i++) {
    const square = []
    for (let j = i * 3; j < i * 3 + 3; j++) {
      square.push(<Square number={j} winArray={index} key={`square${j}`} handleClick={() => onClick(j)} value={squares[j]}></Square>)
    }
    // if (winner) {
    //   let j = index[i]
    //   square[index[i] - i * 3] = <Square isWin={true} key={`square${j}`} handleClick={() => onClick(j)} value={squares[j]}></Square>
    // }
    board.push(<div key={`div${i}`} className="board-row">{square}</div>)
  }

  function onClick(index) {
    if (squares[index] || winner) {
      return
    }
    const nextSquares = squares.slice()
    if (isXNext) {
      nextSquares[index] = "X"
    } else {
      nextSquares[index] = "O"
    }
    onPlay(nextSquares, index)
  }

  let status
  if (winner) {
    status = `Winner is : ${winner}`

  } else {
    status = `Next Player is : ${isXNext ? "X" : "O"}`
  }
  return <>
    <div className="status">{status}</div>
    {board}
  </>
}
export default function Game() {


  const [history, setHistory] = useState([new Array(9).fill(null)])
  const [historyIndex, setHistoryIndex] = useState([0])

  const [isXNext, setIsXNext] = useState(true)
  const [currentMove, setCurrentMove] = useState(0)
  const [isAscending, setIsAscending] = useState(true)
  function order(orderStatus) {
    setIsAscending(orderStatus)
  }
  const currentSquares = history[currentMove]

  function onPlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    const nextHistoryIndex = historyIndex.length > 0 ? [...historyIndex, index] : [index]
    setHistoryIndex(nextHistoryIndex)

    setHistory(nextHistory)
    setIsXNext(!isXNext)
    setCurrentMove(nextHistory.length - 1)
    if (nextHistory.length == 10 && calculateWinner(nextSquares)) {
      setTimeout(() => { window.alert("No One Is Winner!") }, 0)
    }
  }

  function jumpTo(move) {
    setCurrentMove(move)
    setIsXNext(move % 2 === 0)
  }

  const moves = history.map((squares, move) => {
    let position
    let index = historyIndex[move]
    if (index > 5) {
      position = `(3,${index - 5})`
    } else if (index > 2) {
      position = `(2,${index - 2})`
    } else {
      position = `(1,${index + 1})`
    }
    let description
    if (move > 0) {
      description = `Go To Move # ${move} ${position}`
    } else {
      description = "Go To Game Start"
    }
    return <li key={`li${move}`}><button key={`btn${move}`} onClick={() => jumpTo(move)}>{description}</button></li>
  })
  if (isAscending) {

  } else {
    moves.reverse()
  }
  let indicator = `You are at move # ${currentMove + 1}`

  return <>
    <div className="flex">
      <div>
        <div>{indicator}</div>
        <Board onPlay={onPlay} isXNext={isXNext} squares={currentSquares}>
        </Board>
      </div>
      <div className="flex-column-center">
        <div>
          <button onClick={() => order(true)}>升序</button>
          <button onClick={() => order(false)}>降序</button>
        </div>
        <ol>
          {moves}
        </ol>
      </div>

    </div>

  </>
}
function calculateWinner(squares) {
  const winner = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8]
  ]
  for (let i of winner) {
    const [a, b, c] = i
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], index: [a, b, c] }
    }
  }
  return { winner: null, index: null }

}