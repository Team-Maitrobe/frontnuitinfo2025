import React, { useEffect, useRef, useState, useCallback } from 'react';

// 1. Define Types
type Point = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const CANVAS_SIZE = 400;
const BOX_SIZE = 20;
const GRID_COUNT = CANVAS_SIZE / BOX_SIZE; // 20x20 grid

export function SnakeGame() {
  // 2. Refs for Canvas and Game Logic (Mutable state that doesn't trigger re-renders)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // We use refs for game state to avoid stale closures inside the setInterval
  const snakeRef = useRef<Point[]>([{ x: 10 * BOX_SIZE, y: 10 * BOX_SIZE }]);
  const foodRef = useRef<Point>({ x: 15 * BOX_SIZE, y: 15 * BOX_SIZE });
  const directionRef = useRef<Direction | null>(null); // Null initially so it doesn't move until keypress
  const directionLockRef = useRef<boolean>(false); // Prevent double-turn bug
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 3. React State for UI (Score, Game Over)
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Helper: Generate Random Food Position
  const spawnFood = (): Point => {
    return {
      x: Math.floor(Math.random() * (GRID_COUNT - 1) + 1) * BOX_SIZE,
      y: Math.floor(Math.random() * (GRID_COUNT - 1) + 1) * BOX_SIZE,
    };
  };

  // Helper: Check Collisions
  const checkCollision = (head: Point, array: Point[]) => {
    for (let i = 0; i < array.length; i++) {
      if (head.x === array[i].x && head.y === array[i].y) {
        return true;
      }
    }
    return false;
  };

  // 4. Main Game Logic
  const runGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear Canvas
    context.fillStyle = '#1a1a1a'; // Dark background
    context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Food
    context.fillStyle = '#f97316'; // Tailwind orange-500
    context.fillRect(foodRef.current.x, foodRef.current.y, BOX_SIZE, BOX_SIZE);

    // Calculate New Head Position
    let snakeX = snakeRef.current[0].x;
    let snakeY = snakeRef.current[0].y;
    const d = directionRef.current;

    if (d === 'LEFT') snakeX -= BOX_SIZE;
    if (d === 'UP') snakeY -= BOX_SIZE;
    if (d === 'RIGHT') snakeX += BOX_SIZE;
    if (d === 'DOWN') snakeY += BOX_SIZE;

    // Collision Detection (Walls or Self)
    const newHead = { x: snakeX, y: snakeY };

    if (
      snakeX < 0 ||
      snakeX >= CANVAS_SIZE ||
      snakeY < 0 ||
      snakeY >= CANVAS_SIZE ||
      checkCollision(newHead, snakeRef.current)
    ) {
      if (d !== null) { // Only trigger game over if the game has actually started
        setGameOver(true);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      }
      // Even if crashed, draw the snake so the player sees where they died
    } else {
      // Logic: Move Snake
      if (d !== null) {
        // Check if ate food
        if (snakeX === foodRef.current.x && snakeY === foodRef.current.y) {
          setScore((s) => s + 1);
          foodRef.current = spawnFood();
          // Don't pop the tail, so it grows
        } else {
          snakeRef.current.pop(); // Remove tail
        }
        snakeRef.current.unshift(newHead); // Add new head
      }
    }

    // Draw Snake
    for (let i = 0; i < snakeRef.current.length; i++) {
      // Head is green, body is lighter green
      context.fillStyle = i === 0 ? '#22c55e' : '#86efac'; 
      context.fillRect(snakeRef.current[i].x, snakeRef.current[i].y, BOX_SIZE, BOX_SIZE);
      
      context.strokeStyle = '#14532d'; // Dark green border
      context.strokeRect(snakeRef.current[i].x, snakeRef.current[i].y, BOX_SIZE, BOX_SIZE);
    }
    
    // Allow input again after render
    directionLockRef.current = false;

  }, []);

  // 5. Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver) return;
      if (directionLockRef.current) return;

      const key = event.key;
      const d = directionRef.current;

      // Prevent reversing directly
      if (key === 'ArrowLeft' && d !== 'RIGHT') directionRef.current = 'LEFT';
      else if (key === 'ArrowUp' && d !== 'DOWN') directionRef.current = 'UP';
      else if (key === 'ArrowRight' && d !== 'LEFT') directionRef.current = 'RIGHT';
      else if (key === 'ArrowDown' && d !== 'UP') directionRef.current = 'DOWN';
      
      directionLockRef.current = true;
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // 6. Initialize Game Loop
  useEffect(() => {
    // Run the game loop
    gameLoopRef.current = setInterval(runGame, 100);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [runGame]);

  // Reset Game Function
  const resetGame = () => {
    snakeRef.current = [{ x: 10 * BOX_SIZE, y: 10 * BOX_SIZE }];
    foodRef.current = spawnFood();
    directionRef.current = null;
    setScore(0);
    setGameOver(false);
    
    // Restart loop if it was cleared
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(runGame, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Le Snake de P-A
        </h1>
        <p className="text-slate-400">Score: <span className="text-orange-500 font-bold text-xl">{score}</span></p>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-4 border-slate-700 rounded-lg shadow-2xl bg-[#1a1a1a]"
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h2>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-slate-200 transition"
            >
              Rejouer
            </button>
          </div>
        )}
        
        {/* Start Hint Overlay (only shows when game acts as 'paused' at start) */}
        {!directionRef.current && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-white/50 animate-pulse">Press Arrow Keys to Start</p>
          </div>
        )}
      </div>
    </div>
  );
}