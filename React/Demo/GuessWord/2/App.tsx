import React, {useState, useEffect, KeyboardEvent} from 'react'
import './App.css'

function Board(rows: number, cols: number, cells : string[], colors: string[]) {
  const tableRows = []

  for (let i = 0; i < rows; ++ i) {
    const tableRow = []
    for (let j = 0; j < cols; ++ j) {
      const index =  i * cols + j
      tableRow.push(<span key={`cell-${i}-${j}`} className={`cell ${colors[index]}`}>{cells[index]}</span>)
    }
    tableRows.push(<div key={`row-${i}`}>{ tableRow }</div>)
  }

  return (
    <div className='board'>{tableRows}</div>
  )
}

type Config = {
  onClick: () => void,
  score: number,
}

function ControlBar({onClick, score}: Config) {
  return (
    <div>
      <span className='score'>Score: {score}</span>
      <button className='btn' onClick={onClick}>Reset</button>
    </div>
  )
}

function GuessWords() {
  const ROWS = 6, COLS = 5
  const TOTAL = ROWS * COLS
  const [cells, setCells] = useState(new Array(TOTAL).fill(''))
  const [colors, setColors] = useState(new Array(TOTAL).fill(''))
  const [count, setCount] = useState(0)
  const WORDS = ['TODAY', 'HELLO']
  const [wordSet, setWordSet] = useState(new Set(WORDS))
  const [score, setScore] = useState(0)

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (count === TOTAL) {
        return
      }
      if (event.key >= 'a' && event.key <= 'z') {
        const newCells = [...cells]
        const newCount = count + 1
        newCells[count] = event.key.toUpperCase()
        setCells(newCells)
        setCount(count => count + 1)

        if ((count + 1) % COLS === 0) {
          let word = ''
          for (let i = newCount - COLS; i < newCount; ++ i) {
            word += newCells[i]
          }
          if (wordSet.has(word)) {
            for (let i = newCount - COLS; i < newCount; ++ i) {
              colors[i] = 'green'
            }

            wordSet.delete(word)
            setWordSet(wordSet)
            setScore(score => score + 10)
          }
        }

        if (count + 1 === TOTAL) {
          console.log('end')
        }
      }
    }
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  })

  const onClick = () => {
    setCount(0)
    setScore(0)
    setWordSet(new Set(WORDS))
    setCells(new Array(TOTAL).fill(''))
    setColors(new Array(TOTAL).fill(''))
  }

  return (
    <div style={{textAlign: 'center'}}>
      <h2>Guess Words</h2>
      { Board(6, 5, cells, colors) }
      <div>
        { ControlBar({onClick, score}) }
      </div>
    </div>
  )
}


export default function App() {

  return (
    <div className="app">
      { GuessWords() }
      {/* { FizzBuzz() } */}
    </div>
  )
}
