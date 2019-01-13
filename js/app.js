    // Enemies our player must avoid
    var Enemy = function() {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started
        this.TILE_HEIGHT=83;
        this.YPOS_ADJUSTMENT=20;

        // initial x is from -600 (outside screen) to 650-600=50
        this.initial_x = Math.floor(Math.random()*650)-600;

        // initial y is one of the 3 (grey) brick rows, with a slight y position adjustment
        this.initial_y = (1+Math.floor(Math.random()*3))*this.TILE_HEIGHT-this.YPOS_ADJUSTMENT;
        this.x = this.initial_x;
        this.y = this.initial_y;

        // speed is selected randomly from 10 to 810
        this.x_speed = Math.floor(Math.random()*400)+10;

        //console.log(this.x, this.y);

        // used for collision detection, which pixel range 
        //(bounding box) actually contains the enemy figure.
        this.start_x = 2;
        this.stop_x = 99;
        this.width = this.stop_x-this.start_x;

        this.start_y = 78;
        this.stop_y = 142;
        this.height = this.stop_y-this.start_y;

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
        //console.log("increment = ", increment, dt, this.x);
        this.x += increment;
        // https://stackoverflow.com/questions/7540397/convert-nan-to-0-in-javascript
    // this.x = this.x || this.inital_x;
        if(this.x > 1100) {
           // this.x = this.initial_x;
           this.resetPosition();
        }

        // check if enemy hits player
        //console.log("THISX = ", this.inital_x, this.x);
    };

    // Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.

    var Player = function(allEnemies) {
        this.board_x = 0;
        this.board_y = 0;
        this.x = 0;
        this.y = 0;
        this.TILE_HEIGHT=83;
        this.TILE_WIDTH=101;
        this.YPOS_ADJUSTMENT=0; // move figure 20 pixels up
        this.sprite = 'images/char-boy.png';
        this.allEnemies = allEnemies;
        // used for collision detection, which pixel range 
        //(bounding box) actually contains the enemy figure.
        this.start_x = 17;
        this.stop_x = 84;
        this.width = this.stop_x-this.start_x;

        this.start_y = 40;
        this.stop_y = 107;
        this.height = this.stop_y-this.start_y;
    }

    Player.prototype.resetPosition = function() {
        this.board_x = Math.floor(Math.random()*5); // from 0 to 4
        this.board_y = Math.floor(Math.random()*2)+4; // from 4 to 5
        this.x = this.board_x*this.TILE_WIDTH; // max x = 4x101, min x = 0, min start_x = 0
        this.y = this.board_y*this.TILE_WIDTH-this.YPOS_ADJUSTMENT; // max y 
    }

    // Uncaught TypeError: Failed to execute 'drawImage' on 
    // 'CanvasRenderingContext2D': The provided value is not of type 
    // '(CSSImageValue or HTMLImageElement or SVGImageElement or 
    // HTMLVideoElement or HTMLCanvasElement or ImageBitmap or 
    // OffscreenCanvas)'

 
    Player.prototype.handleInput = function(keyCode) {
        //console.log("KEYCODE:", keyCode);
        switch(keyCode) {
            case 'up':
                this.board_y = Math.max(0, this.board_y-1);
                break;
            case 'down':
                this.board_y = Math.min(5, this.board_y+1);
                break;
            case 'right':
                this.board_x = Math.min(4, this.board_x+1);
                break;
            case 'left':
                this.board_x = Math.max(0, this.board_x-1);
                break;
        }
    }

    Player.prototype.update = function() {
        this.x = this.board_x*this.TILE_WIDTH; // max x = 4x101, min x = 0, min start_x = 0
        this.y = this.board_y*this.TILE_HEIGHT-this.YPOS_ADJUSTMENT; // max y 

        // check for collision with enemies, if collision reset position
    }

    /* Box model detection, return true on collision */
    Player.prototype.checkCollision = function( player, enemy ) {
        // the actual figure for both enemy and player start
        // not at the boundary of the figure, so need to calculate
        // actual positions to check.
        var p_y = player.y + player.start_y;
        var p_x = player.x + player.start_x;
        var e_y = enemy.y + enemy.start_y;
        var e_x = enemy.x + enemy.start_x;
        //console.log(p_x,p_y, e_x, e_y)

        // check for non collision cases and return true if anyone of them fails
        // the 4 cases are:
        // 1) player to the left of enemy
        var player_to_the_left_of_enemy = ((p_x+player.width) < e_x);
        if(player_to_the_left_of_enemy) {
            return false;
        }
        // 2) player to the right of enemy
        var player_to_the_right_of_enemy = (p_x > (e_x+enemy.width));
        if(player_to_the_right_of_enemy) {
            return false;
        }
        // 3) player above the enemy - note: high = low y value, 
        //    low = high y value)
        var player_above_the_enemy = ((p_y+player.height) < e_y);
        if(player_above_the_enemy) {
            return false;
        }
        // 4) player below the enemy
        var player_below_the_enemy = (p_y > (e_y+enemy.height));
        if(player_below_the_enemy) {
            return false;
        }

        return true;
    }


    Player.prototype.collidesWith = function() {
        // check if boundaries of player overlaps with boundaries of enemy
        // return true if overlap otherwise false
        for(var i=0; i<this.allEnemies.length; ++i) {
            var enemy = this.allEnemies[i];
            if(this.checkCollision(this, enemy)) {
                return true;
            }
        }
        return false;
    }

    Player.prototype.render = function() {
        //console.log(this.sprite, this.x, this.y);
        if(this.collidesWith()) {
            this.resetPosition();
        }
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        // check for collision and reset
        // check for win
    }


    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player

    var allEnemies = [new Enemy(), new Enemy(), new Enemy(), 
                   new Enemy(), new Enemy()];
    var player = new Player(allEnemies); 
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
