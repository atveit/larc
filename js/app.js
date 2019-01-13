// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.inital_x = Math.floor(Math.random()*650)-600; 
    this.initial_y = (1+Math.floor(Math.random()*3))*83-20;
    this.x = this.inital_x;
    this.y = this.initial_y;
    this.x_speed = Math.floor(Math.random()*300)+10;

    console.log(this.x, this.y);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.resetPosition = function() {
    this.x = Math.floor(Math.random(1100))-300; // from -300 to 800, i.e. outside
    this.y = (1+Math.floor(Math.random(3)))*83-20; // from 0 to 2x83-20
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //console.log("DT=", dt); // e.g. 0.017 on my mac
    var increment = Math.floor(parseFloat(this.x_speed)*parseFloat(dt));
    console.log("increment = ", increment, dt, this.x);
    this.x += increment;
    // https://stackoverflow.com/questions/7540397/convert-nan-to-0-in-javascript
   // this.x = this.x || this.inital_x;
    if(this.x > 1500) {
        this.x = this.inital_x;
    }
    console.log("THISX = ", this.inital_x, this.x);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.board_x = 0;
    this.board_y = 0;
    this.x = 0;
    this.y = 0;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.resetPosition = function() {
    this.board_x = Math.floor(Math.random()*5); // from 0 to 4
    this.board_y = Math.floor(Math.random()*2)+4; // from 4 to 5
    this.x = this.board_x*101; // max x = 4x101, min x = 0, min start_x = 0
    this.y = this.board_y*83-20; // max y 
}

// Uncaught TypeError: Failed to execute 'drawImage' on 
// 'CanvasRenderingContext2D': The provided value is not of type 
// '(CSSImageValue or HTMLImageElement or SVGImageElement or 
// HTMLVideoElement or HTMLCanvasElement or ImageBitmap or 
// OffscreenCanvas)'

Player.prototype.render = function() {
    console.log(this.sprite, this.x, this.y);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(keyCode) {

}

Player.prototype.update = function() {

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(), new Enemy, new Enemy()];
var player = new Player(); 
player.resetPosition();

console.log(allEnemies);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
