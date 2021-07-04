import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {  
    const boardSize = 3;  
    let squaresBoard = [];
    for(var i = 0; i < boardSize; ++i) {
      let row = [];
      for(var j = 0; j < boardSize; ++j) {
        row.push(this.renderSquare(i * boardSize + j));
      }
      squaresBoard.push(<div key={i} className="board-row">
          {row}
        </div>);
    }
    return (    
      <div>
        {squaresBoard}
      </div>
    );
  }
}

class Game extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }

  handleClick(i) {
    let row = Math.floor(i/3);
    let col = i % 3;
    console.log(`User clicked: square#${i} col[${col}] row[${row}]`);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];    
    const squares = current.squares.slice();    
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xisNext? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,  
        row: Math.floor(i/3),
        col: i % 3 
      }]),
      xisNext: !this.state.xisNext,
      stepNumber: history.length,    
    });
  }

  jumpTo(step) {
    this.setState({      
      xIsNext: (step % 2) === 0,
      stepNumber: step,      
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move)=> {
      const description = move ? 
        `Go to move #${move} (${step.row}, ${step.col})` :
        `Go to game start` ;
          return (        
            <li key={move}>
              <button 
                className={(move === history.length - 1) ? "bold-current-history" : ""} 
                onClick={()=> this.jumpTo(move)}>{description}</button>
            </li>            
          );             
    });

    let status;
    if (winner != null) {
      status = 'Winner: ' + winner;
    } else if (winner === null && history.length === 10){
      status = 'The Game Ended in a Draw'
    } else {
      status = 'Current Player\'s Turn: ' + (this.state.xisNext? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
