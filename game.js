// Define the game canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Define game variables
let enemies = [];
let towers = [];
let projectiles = [];
let score = 0;
let lives = 10;

// Define the Enemy class
class Enemy {
  constructor(x, y, speed, health) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.health = health;
    this.radius = 20;
  }

  // Update the enemy's position
  update() {
    this.x += this.speed;
    if (this.x > canvas.width + this.radius) {
      this.x = -this.radius;
    }
  }

  // Draw the enemy on the canvas
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }
}

// Define the Tower class
class Tower {
  constructor(x, y, range, damage) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.radius = 30;
  }

  // Shoot a projectile at the nearest enemy
  shoot() {
    const nearestEnemy = enemies.reduce((closest, enemy) => {
      const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
      return distance < this.range && (closest === null || distance < closest.distance)
        ? { enemy, distance }
        : closest;
    }, null);

    if (nearestEnemy) {
      projectiles.push(new Projectile(this.x, this.y, nearestEnemy.enemy.x, nearestEnemy.enemy.y, this.damage));
    }
  }

  // Draw the tower on the canvas
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  }
}

// Define the Projectile class
class Projectile {
  constructor(x, y, targetX, targetY, damage) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.damage = damage;
    this.speed = 10;
    this.radius = 10;
  }

  // Update the projectile's position and check for collisions
  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance > this.speed) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    } else {
      this.x = this.targetX;
      this.y = this.targetY;

      // Check for collision with an enemy
      const enemy = enemies.find(e => {
        const distance = Math.sqrt((e.x - this.x) ** 2 + (e.y - this.y) ** 2);
        return distance < e.radius;
      });

      if (enemy) {
        enemy.health -= this.damage;
        if (enemy.health <= 0) {
          enemies.splice(enemies.indexOf(enemy), 1);
          score += 100;
        }
        projectiles.splice(projectiles.indexOf(this), 1);
      }
    }
  }

  // Draw the projectile on the canvas
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
  }
}

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw the enemies
  enemies.forEach(enemy => {
    enemy.update();
    enemy.draw();
  });

  // Update and draw the towers
  towers.forEach(tower => {
    tower.shoot();
    tower.draw();
  });

  // Update and draw the projectiles
  projectiles.forEach(projectile => {
    projectile.update();
    projectile.draw();
  });

  // Draw the score and lives
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, 10, 60);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
