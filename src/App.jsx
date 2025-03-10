import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  );

  const boardRef = useRef(null);

  function generateFood() {
    return {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  }

  function resetGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) {
        resetGame();
        return;
      }
      const newDirection = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      }[e.key];
      if (newDirection) setDirection(newDirection);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE ||
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          if (score > highScore) {
            localStorage.setItem("highScore", score);
            setHighScore(score);
          }
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood());
          setScore((prev) => prev + 10);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  return (
    <div className="game-container" onClick={resetGame}>
      <h1>Snake Game</h1>
      <h2>
        Score: {score} | High Score: {highScore}
      </h2>
      {gameOver && <h2>Game Over! Click anywhere to restart.</h2>}
      <div className="board" ref={boardRef}>
        {[...Array(BOARD_SIZE)].map((_, y) => (
          <div key={y} className="row">
            {[...Array(BOARD_SIZE)].map((_, x) => {
              const isSnake = snake.some((s) => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;
              return (
                <div
                  key={x}
                  className={`cell ${isSnake ? "snake" : ""} ${
                    isFood ? "food" : ""
                  }`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
