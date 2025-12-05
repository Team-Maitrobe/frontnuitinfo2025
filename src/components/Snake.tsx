import { useEffect, useRef, useState, useCallback } from 'react';
import technos from '../assets/technos.json';

// 1. Define Types
type Point = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type SnakeSegment = {
  position: Point;
  technology?: {
    name: string;
    nonOpenSource: string;
    openSource: string;
  };
};

type Fruit = {
  position: Point;
  technology: {
    name: string;
    nonOpenSource: string;
    openSource: string;
  };
};

const CANVAS_SIZE = 400;
const MIN_CANVAS_SIZE = 400;
const MAX_CANVAS_SIZE = 600;
const BOX_SIZE = 40;
const GRID_COUNT = CANVAS_SIZE / BOX_SIZE; // 10x10 grid

export function SnakeGame() {
  // 2. Refs for Canvas and Game Logic (Mutable state that doesn't trigger re-renders)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for responsive canvas size
  const [canvasSize, setCanvasSize] = useState(CANVAS_SIZE);
  const gridCountRef = useRef(GRID_COUNT);
  
  // We use refs for game state to avoid stale closures inside the setInterval
  const snakeRef = useRef<SnakeSegment[]>([{ position: { x: 4 * BOX_SIZE, y: 4 * BOX_SIZE } }]);
  const foodRef = useRef<Fruit>({
    position: { x: 7 * BOX_SIZE, y: 7 * BOX_SIZE },
    technology: technos.technologies[0],
  });
  const directionRef = useRef<Direction | null>(null); // Null initially so it doesn't move until keypress
  const directionLockRef = useRef<boolean>(false); // Prevent double-turn bug
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});
  const capturedTechRef = useRef<Array<{
    name: string;
    nonOpenSource: string;
    openSource: string;
  }>>([]);

  // 3. React State for UI (Score, Game Over)
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Helper: Generate Random Food Position and Technology
  const spawnFood = useCallback((): Fruit => {
    const gridCount = canvasSize / BOX_SIZE;
    const randomTech = technos.technologies[Math.floor(Math.random() * technos.technologies.length)];
    return {
      position: {
        x: Math.floor(Math.random() * (gridCount - 1) + 1) * BOX_SIZE,
        y: Math.floor(Math.random() * (gridCount - 1) + 1) * BOX_SIZE,
      },
      isEaten: false,
      technology: randomTech,
    };
  }, [canvasSize]);

  // Helper: Check Collisions
  const checkCollision = (head: Point, array: SnakeSegment[]) => {
    for (let i = 0; i < array.length; i++) {
      if (head.x === array[i].position.x && head.y === array[i].position.y) {
        return true;
      }
    }
    return false;
  };

  // 4. Initialize Images
  useEffect(() => {
    // Load head image
    const headImg = new Image();
    headImg.onload = () => {
      imagesRef.current['head'] = headImg;
    };
    headImg.onerror = () => {
      console.warn(`Failed to load head image: /technos/head.png`);
    };
    headImg.src = `/technos/head.png`;

    technos.technologies.forEach((tech) => {
      const imgNonOpen = new Image();
      imgNonOpen.onload = () => {
        imagesRef.current[`${tech.name}-non-open`] = imgNonOpen;
      };
      imgNonOpen.onerror = () => {
        console.warn(`Failed to load image: /technos${tech.nonOpenSource}`);
      };
      imgNonOpen.src = `/technos${tech.nonOpenSource}`;

      const imgOpen = new Image();
      imgOpen.onload = () => {
        imagesRef.current[`${tech.name}-open`] = imgOpen;
      };
      imgOpen.onerror = () => {
        console.warn(`Failed to load image: /technos${tech.openSource}`);
      };
      imgOpen.src = `/technos${tech.openSource}`;
    });
  }, []);

  // 4.5 Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      const availableSize = Math.min(window.innerWidth - 40, window.innerHeight - 200);
      const newSize = Math.max(MIN_CANVAS_SIZE, Math.min(availableSize, MAX_CANVAS_SIZE));
      setCanvasSize(newSize);
      gridCountRef.current = newSize / BOX_SIZE;
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 5. Main Game Logic
  const runGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear Canvas
    context.fillStyle = '#1a1a1a'; // Dark background
    context.fillRect(0, 0, canvasSize, canvasSize);

    // Draw Food with image (always show non-open source)
    const fruitImageKey = `${foodRef.current.technology.name}-non-open`;
    const fruitImage = imagesRef.current[fruitImageKey];
    
    if (fruitImage && fruitImage.complete && fruitImage.naturalHeight !== 0) {
      try {
        context.drawImage(
          fruitImage,
          foodRef.current.position.x,
          foodRef.current.position.y,
          BOX_SIZE,
          BOX_SIZE
        );
      } catch (e) {
        // Fallback if image draw fails
        context.fillStyle = '#f97316';
        context.fillRect(foodRef.current.position.x, foodRef.current.position.y, BOX_SIZE, BOX_SIZE);
      }
    } else {
      // Fallback if image not loaded
      context.fillStyle = '#f97316';
      context.fillRect(foodRef.current.position.x, foodRef.current.position.y, BOX_SIZE, BOX_SIZE);
    }

    // Calculate New Head Position
    let snakeX = snakeRef.current[0].position.x;
    let snakeY = snakeRef.current[0].position.y;
    const d = directionRef.current;

    if (d === 'LEFT') snakeX -= BOX_SIZE;
    if (d === 'UP') snakeY -= BOX_SIZE;
    if (d === 'RIGHT') snakeX += BOX_SIZE;
    if (d === 'DOWN') snakeY += BOX_SIZE;

    // Collision Detection (Walls or Self)
    const newHead = { x: snakeX, y: snakeY };

    if (
      snakeX < 0 ||
      snakeX >= canvasSize ||
      snakeY < 0 ||
      snakeY >= canvasSize ||
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
        // Add new head first
        const newHeadSegment: SnakeSegment = { position: newHead };
        snakeRef.current.unshift(newHeadSegment); // Add new head
        
        // Check if ate food
        if (snakeX === foodRef.current.position.x && snakeY === foodRef.current.position.y) {
          // Store the captured technology
          capturedTechRef.current.push(foodRef.current.technology);
          
          setScore((s) => s + 1);
          foodRef.current = spawnFood();
        } else {
          snakeRef.current.pop(); // Remove tail if didn't eat
        }
      }
    }

    // Draw Snake
    for (let i = 0; i < snakeRef.current.length; i++) {
      const segment = snakeRef.current[i];
      
      // Head uses the preset head image
      if (i === 0) {
        const headImage = imagesRef.current['head'];
        if (headImage && headImage.complete && headImage.naturalHeight !== 0) {
          try {
            context.drawImage(
              headImage,
              segment.position.x,
              segment.position.y,
              BOX_SIZE,
              BOX_SIZE
            );
          } catch (e) {
            // Fallback
            context.fillStyle = '#22c55e';
            context.fillRect(segment.position.x, segment.position.y, BOX_SIZE, BOX_SIZE);
          }
        } else {
          // Fallback if image not loaded
          context.fillStyle = '#22c55e';
          context.fillRect(segment.position.x, segment.position.y, BOX_SIZE, BOX_SIZE);
        }
        // Draw border for head
        context.strokeStyle = '#14532d';
        context.strokeRect(segment.position.x, segment.position.y, BOX_SIZE, BOX_SIZE);
      }
      // Check if this segment corresponds to a captured technology
      else if (i - 1 < capturedTechRef.current.length) {
        const capturedTech = capturedTechRef.current[i - 1];
        const techImageKey = `${capturedTech.name}-open`;
        const techImage = imagesRef.current[techImageKey];
        
        if (techImage && techImage.complete && techImage.naturalHeight !== 0) {
          try {
            // Clear the area first
            context.clearRect(segment.position.x, segment.position.y, BOX_SIZE, BOX_SIZE);
            // Draw image to fit square (squashed)
            context.drawImage(
              techImage,
              segment.position.x,
              segment.position.y,
              BOX_SIZE,
              BOX_SIZE
            );
          } catch (e) {
            // Fallback
            context.fillStyle = '#86efac';
            context.fillRect(segment.position.x, segment.position.y, BOX_SIZE, BOX_SIZE);
          }
        } else {
          // Fallback if image not loaded
          context.fillStyle = '#86efac';
          context.fillRect(segment.position.x, segment.position.y, BOX_SIZE, BOX_SIZE);
        }
        // NO border for captured technologies
      } else {
        // Regular body segment without technology
        context.fillStyle = '#86efac'; 
        context.fillRect(segment.position.x, segment.position.y, BOX_SIZE, BOX_SIZE);
        // Draw border for regular segments
        context.strokeStyle = '#14532d';
        context.strokeRect(segment.position.x, segment.position.y, BOX_SIZE, BOX_SIZE);
      }
    }
    
    // Allow input again after render
    directionLockRef.current = false;

  }, [canvasSize]);

  // 6. Handle Keyboard Input
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

  // 7. Initialize Game Loop
  useEffect(() => {
    // Run the game loop
    gameLoopRef.current = setInterval(runGame, 125);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [runGame]);

  // Reset Game Function
  const resetGame = () => {
    snakeRef.current = [{ position: { x: 4 * BOX_SIZE, y: 4 * BOX_SIZE } }];
    capturedTechRef.current = [];
    foodRef.current = spawnFood();
    directionRef.current = null;
    setScore(0);
    setGameOver(false);
    
    // Restart loop if it was cleared
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(runGame, 125);
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
          width={canvasSize}
          height={canvasSize}
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

      {/* Captured Technologies Display */}
      {gameOver && capturedTechRef.current.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Vos alternatives Open Source :
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capturedTechRef.current.map((tech, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                <h3 className="text-white font-bold mb-3 text-center">{tech.name}</h3>
                <div className="flex gap-4 items-center">
                  {/* Non-open source image */}
                  <div className="flex flex-col items-center">
                    <img
                      src={`/technos${tech.nonOpenSource}`}
                      alt="Proprietary"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="text-xs text-gray-400 mt-2">Propriétaire</span>
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-2xl text-green-500">→</div>
                  
                  {/* Open source image */}
                  <div className="flex flex-col items-center">
                    <img
                      src={`/technos${tech.openSource}`}
                      alt="Open Source"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="text-xs text-green-400 mt-2">Open Source</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}