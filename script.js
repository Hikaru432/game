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
canvas.width = 900;
canvas.height = 700;

// Animal-Food pairing and backgrounds
const animalFood = {
  cow: 'grass',
  lion: 'meat',
  chicken: 'seeds',
};

// Animal backgrounds
const animalBackgrounds = {
  cow: 'img/CowBG.jpg',
  lion: 'img/LionBG.jpg',
  chicken: 'img/ChickenBG.jpg',
};

// Preload food images
const foodImages = {
  grass: 'img/grass.png',
  meat: 'img/meat.png',
  seeds: 'img/seeds.png',
};

Object.keys(foodImages).forEach(type => {
  const img = new Image();
  img.src = foodImages[type];
});

// Start the game with selected animal background
document.querySelectorAll('.animal-button').forEach(button => {
  button.addEventListener('click', (e) => {
    selectedAnimal = e.target.dataset.animal;
    animalIcon = new Image();

    if (selectedAnimal === 'cow') {
      animalIcon.src = 'img/cow.png';
    } else if (selectedAnimal === 'chicken') {
      animalIcon.src = 'img/chicken.png';
    } else if (selectedAnimal === 'lion') {
      animalIcon.src = 'img/lion.png';
    }

    // Set background based on selected animal
    const backgroundPath = animalBackgrounds[selectedAnimal];
    gameScreen.style.backgroundImage = `url(${backgroundPath})`;
    gameScreen.style.backgroundSize = 'cover';

    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
  });
});


// Set background based on selected animal with gradient
const gradientColor = 'rgba(0, 0, 0, 0.5)'; // Example: black with 50% opacity
const backgroundPath = animalBackgrounds[selectedAnimal];
gameScreen.style.backgroundImage = `linear-gradient(${gradientColor}, ${gradientColor}), url(${backgroundPath})`;
gameScreen.style.backgroundSize = 'cover';


// Food constructor
class Food {
  constructor(type) {
    this.type = type;
    this.x = Math.random() * (canvas.width - 60);
    this.y = 0;
    this.speed = Math.random() * 1 + 0.5;
    this.image = new Image();
    this.image.src = foodImages[type];
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, 60, 60);
  }

  update() {
    this.y += this.speed;
    this.draw();
  }
}

// Draw animal
function drawAnimal() {
  ctx.drawImage(animalIcon, animalX, canvas.height - 90, 100, 70);
}

// Main game loop
function startGame() {
  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;
  foods.length = 0;

  gameInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ensure only up to 5 foods fall at once, with 85% chance of preferred food
    if (foods.length < 5) {
      const foodType = Math.random() < 0.85
        ? animalFood[selectedAnimal]
        : getRandomFoodType(selectedAnimal);
      foods.push(new Food(foodType));
    }

    foods.forEach((food, index) => {
      food.update();
      if (food.y > canvas.height) {
        foods.splice(index, 1);
      }

      // Check for collision with animal
      if (
        food.y + 60 > canvas.height - 90 &&
        food.x + 60 > animalX &&
        food.x < animalX + 100
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

// Function to get a random food type that is not the preferred food
function getRandomFoodType(preferredAnimal) {
  const types = Object.values(animalFood).filter(type => type !== animalFood[preferredAnimal]);
  return types[Math.floor(Math.random() * types.length)];
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

// Mobile controls
document.getElementById('move-left').addEventListener('click', () => {
  if (animalX > 0) {
    animalX -= animalSpeed;
  }
});
document.getElementById('move-right').addEventListener('click', () => {
  if (animalX < canvas.width - 120) {
    animalX += animalSpeed;
  }
});
