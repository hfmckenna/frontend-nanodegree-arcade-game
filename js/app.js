// Enemies our player must avoid
const Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101;
    this.y = -25;
    this.speed = getRandomArbitrary();
};

// Used for enemy speed, placeholder code from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomArbitrary() {
    return Math.random() * (350 - 150) + 150;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > 606) {
        this.x = -101;
        this.speed = getRandomArbitrary() + (player.score * 5);
    } else {
        this.x += dt * this.speed;
    }
    if (this.y === player.y) {
        if (this.x > player.x && this.x < (player.x + 73) || this.x < player.x && (this.x + 83) > player.x) {
            player.lives -= 1;
            if (player.lives > 0) {
                resetGame();
            } else {
                gameOver();
            }
        }
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

const Player = function () {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 390;
    this.lives = 3;
    this.score = 0;
};

Player.prototype.update = function (dt) {
    // Restricts movement of the player on the grid.
    this.x = Math.min(404, Math.max(0, this.x));
    this.y = Math.min(390, Math.max(-25, this.y));
    if (this.y < 57) {
        this.score += 1;
        resetGame();
    }
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //Bit janky to add Lives and Score here for drawing but they are both player related and saves modifying the Engine code. Might be worth a quick perf check.
    document.getElementById('gameInfo').textContent = `Lives: ${player.lives} Score: ${player.score}`
};

Player.prototype.handleInput = function (e) {
    // Might be able to come up with object based solution rather than switch casing but somewhat unsure of this targeting.
    switch (e) {
        case 'left':
            this.x -= 101
            break;
        case 'right':
            this.x += 101
            break;
        case 'up':
            this.y -= 83
            break;
        case 'down':
            this.y += 83
            break;
    }
};

Player.prototype.reset = function () {
    this.x = 202;
    this.y = 390;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [];
generateEnemies();
// Could maybe use spread operator for more succinct code but suspect push method will let me increase the difficulty as time goes on.

function generateEnemies() {
    for (let i = 1; i <= 3; i++) {
        const enemy = new Enemy();
        allEnemies.push(enemy);
        enemy.y = enemy.y + (83 * i);
    }
};

let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function resetGame() {
    allEnemies = [];
    generateEnemies();
    player.reset();
}

function restartGame() {
    allEnemies = [];
    generateEnemies();
    player = new Player;
    const deleteButton = document.getElementById('resetBtn');
    deleteButton.outerHTML = "";
}

function gameOver() {
    //Empty functions used on player death to "stop" the game, without producing errors in the engine or reloading anything.
    //This could be achieved with cancelAnimationFrame in Engine but that has it's own set of issues.
    player.update = function () {};
    for (let i = 0; i < allEnemies.length; i++) {
        allEnemies[i].update = function () {};
    }
    player.handleInput = function () {};
    const resetButton = document.createElement('button');
    resetButton.textContent = 'You Died. Try Again?';
    resetButton.id = 'resetBtn';
    resetButton.setAttribute('onclick', 'restartGame()')
    document.body.appendChild(resetButton);
}