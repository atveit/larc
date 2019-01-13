    /*
     * Representation and state of the enemy.
     */
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

    /*
     * @description Resets the position of the enemy, note that it can 
     * also be outside the screen with negative or too large x coordinates
     */
    Enemy.prototype.resetPosition = function() {
        this.x = Math.floor(Math.random(1100))-300; // from -300 to 800, i.e. outside
        this.y = (1+Math.floor(Math.random(3)))*83-20; // from 0 to 2x83-20
    }

    /*
     * @description Update the enemy's position, required method for game
     * @param {dt} a time delta between ticks (varies by computer)
     */
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

    /*
     * @description Draw the enemy on the screen
     */
    Enemy.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

     /*
     * Representation and state of the player.
     */
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

    /*
     * @description Resets the position of the player
     */
    Player.prototype.resetPosition = function() {
        //console.log("RESETPOSITION PLAYER..")
        this.board_x = Math.floor(Math.random()*5); // from 0 to 4
        this.board_y = Math.floor(Math.random()*2)+4; // from 4 to 5
        this.x = this.board_x*this.TILE_WIDTH; // max x = 4x101, min x = 0, min start_x = 0
        this.y = this.board_y*this.TILE_WIDTH-this.YPOS_ADJUSTMENT; // max y 
    }

    /*
     * @description updates board position based on keyboard input
     * @param {keyCode} the string representation of a keyCode
     */
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

    /*
     * @description updates the screen position of the Player
     */
    Player.prototype.update = function() {
        this.x = this.board_x*this.TILE_WIDTH; // max x = 4x101, min x = 0, min start_x = 0
        this.y = this.board_y*this.TILE_HEIGHT-this.YPOS_ADJUSTMENT; // max y 

        // check for collision with enemies, if collision reset position
    }

    /*
     * @description Checks for (bounding box) collision between 
     * the player and an enemy
     * @param {player} object with contains position information
     * @param {enemy} withcontains position information
     * @returns {boolean} true if collision, otherwise false
     */ 
    Player.prototype.checkCollision = function( player, enemy ) {
        //console.log("CHECKCOLL..");
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


    /*
     * @description Checks collision between the player and all the enemies.
     */
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

    /*
     * @description sleep method - used by win congratulation message
     * @param {ms} - number of milliseconds to sleep
     * @return {Promise} 
     */
    Player.prototype.sleep = async function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
     * @description method that provides a (temporary) congratulation message
     * at the top of screen. It also (visually) updates the number of 
     * win strikes in a row
     */
    Player.prototype.congrats = async function() {
        var gameresult = document.querySelector('.gameresult');
        var num_win_strikes = document.querySelector('.num_win_strikes');
        var updated_num_win_strikes = 1+parseInt(num_win_strikes.innerHTML)
        num_win_strikes.innerHTML = updated_num_win_strikes;

        gameresult.innerHTML = "Congratulations, you won!"
        gameresult.style.color = "blue";
        this.resetPosition(); // start the game again
        await this.sleep(5000);
        gameresult.innerHTML = "";
        this.check_for_collision = false;
    }
      
    /*
     * Renders the player.
     */
    Player.prototype.render = async function() {
        //console.log(this.sprite, this.x, this.y);
        if(this.collidesWith()) {
            this.resetPosition(); // start the game again
            var num_win_strikes = document.querySelector('.num_win_strikes');
            num_win_strikes.innerHTML = "0";
        }

        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

        //console.log(this.x, this.y);

        if(this.y == 0) { // i.e. in the top row
            await this.congrats();
        }
    }

    // Creates all the enemy objects
    var allEnemies = [new Enemy(), new Enemy(), new Enemy(), 
                   new Enemy(), new Enemy()];

    // Creates the player
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
