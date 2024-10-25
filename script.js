const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let selectedAnimal = '';
let animalIcon;
let animalX = canvas.width / 2 - 25;
const animalSpeed = 8;
let gameInterval;
const foods = [];
canvas.width = 900; // Slightly wider field
canvas.height = 700; // Increased height

// Animal-Food pairing
const animalFood = {
  cow: 'grass',
  lion: 'meat',
  chicken: 'seeds',
};

// Load food images
const foodImages = {
  grass: 'img/grass.png',
  meat: 'img/meat.png',
  seeds: 'img/seeds.png',
};

// Start the game
document.querySelectorAll('.animal-button').forEach(button => {
  button.addEventListener('click', (e) => {
    selectedAnimal = e.target.dataset.animal;
    animalIcon = new Image();
    
    // Use the provided URLs for animal icons
    if (selectedAnimal === 'cow') {
      animalIcon.src = 'img/cow.png';
    } else if (selectedAnimal === 'chicken') {
      animalIcon.src = 'img/chicken.png';
    } else if (selectedAnimal === 'lion') {
      animalIcon.src = 'img/lion.png';
    }
    
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
  });
});

// Food constructor
class Food {
  constructor(type) {
    this.type = type;
    this.x = Math.random() * (canvas.width - 60); // Adjusted for larger image width
    this.y = 0;
    this.speed = Math.random() * 2 + 1;
    this.image = new Image();
    this.image.src = foodImages[type]; // Set image based on type
  }
  
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 60, 60); // Increased food size
  }
  
  update() {
    this.y += this.speed;
    this.draw();
  }
}

// Draw animal
function drawAnimal() {
  ctx.drawImage(animalIcon, animalX, canvas.height - 90, 100, 70); // Increased animal size
}

// Main game loop
function startGame() {
  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;
  foods.length = 0;
  
  gameInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.03) {
      // Random food selection
      const types = ['grass', 'meat', 'seeds'];
      const foodType = types[Math.floor(Math.random() * types.length)];
      foods.push(new Food(foodType));
    }
    
    foods.forEach((food, index) => {
      food.update();
      if (food.y > canvas.height) {
        foods.splice(index, 1);
      }
      
      // Check for collision with animal
      if (
        food.y + 60 > canvas.height - 90 && // Updated to match new food size
        food.x + 60 > animalX && // Check right edge of food with left edge of animal
        food.x < animalX + 100 // Check left edge of food with right edge of animal
      ) {
        if (food.type === animalFood[selectedAnimal]) {
          score++;
          scoreDisplay.innerText = score;
          foods.splice(index, 1);
        } else {
          gameOver();
        }
      }
    });
    
    drawAnimal();
  }, 30);
}

// Game Over and Restart
function gameOver() {
  clearInterval(gameInterval);
  finalScore.innerText = score;
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
}

// Restart game
document.getElementById('restart-button').addEventListener('click', () => {
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

// Move animal with arrow keys
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && animalX > 0) {
    animalX -= animalSpeed;
  } else if (e.key === 'ArrowRight' && animalX < canvas.width - 120) {
    animalX += animalSpeed;
  }
});
