// class Main is the scene that holds the entire game. other games may
// multiple scenes holding things like menu scene. loading scene, play scene

class Main {
  // this scene has three methods
  // preload is called once at the begining and will load all assets (sprites, sounds etc)
  
  
//   PRELOAD ------------------------------------
  preload() {
    // this loads a sprite image
    this.load.image("player", "assets/player.png");

    this.load.image("enemy", "assets/enemy.png");

    // this loads horizontal wall and a vertical wall image
    this.load.image("wallV", "assets/wallVertical.png");
    this.load.image("wallH", "assets/wallHorizontal.png");

    //COIN** loading another sprite
    this.load.image("coin", "assets/coin.png");
  }


  //  CREATE FUNCTIONS --------------------------------
  //   create is called once, just after preload and initialize the scene, like postion of sprites

  create() {
    this.createWorld();
    this.arrow = this.input.keyboard.createCursorKeys();

    this.enemies = this.physics.add.group();
    this.time.addEvent({
      delay: 2200,
      callback: () => this.addEnemy(),
      loop: true,
    });

    // this places this sprite in the center of the scene
    this.player = this.physics.add.sprite(250, 170, "player");
    // this gives the sprite gravity so it will fall
    this.player.body.gravity.y = 500;



    // COIN** and then add sprite into the create method
    this.coin = this.physics.add.sprite(60, 130, "coin");

    // ADDING SCOREBOARD
    this.scoreLabel = this.add.text(30, 25, "score: 0", {
      font: "18px Arial",
      fill: "#fff",
    });
    this.score = 0;
  }

//   UPDATE ----------------------------------------
  // this method is called 60 times/second  after create and handles all the games logic like movements
  update() {
    this.physics.collide(this.player, this.walls);
    this.movePlayer();

    if (this.player.y > 340 || this.player.y < 0) {
      this.playerDie();
    }

    if (this.physics.overlap(this.player, this.coin)) {
      this.takeCoin();
    }

    this.physics.collide(this.enemies, this.walls);

    if(this.physics.overlap(this.player, this.enemies)){
        this.playerDie();
    }
  }
  
  
//    ENEMY FUNCTIONS -----------------------------
  
  addEnemy() {
    let enemy = this.enemies.create(250, -10, 'enemy');
    
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = Phaser.Math.RND.pick([-100, 100]);
    enemy.body.bounce.x = 1;
    
    this.time.addEvent({
        delay:10000,
        callback: () => enemy.destroy(),
    })
    };

  
//   PLAYER FUNCTIONS -----------------------------------
    movePlayer() {
    if (this.arrow.left.isDown) {
      this.player.body.velocity.x = -200;
    } else if (this.arrow.right.isDown) {
      this.player.body.velocity.x = 200;
    } else {
      this.player.body.velocity.x = 0;
    }

    if (this.arrow.up.isDown && this.player.body.onFloor()) {
      this.player.body.velocity.y = -320;
    }
  }

  playerDie() {
    this.scene.start("main");
  }


  createWorld() {
    // this creates all the wall into a group. (if we removed static from staticGroup, the walls would move
    // when collided with)
    this.walls = this.physics.add.staticGroup();

    this.walls.create(10, 170, "wallV"); //left
    this.walls.create(490, 170, "wallV"); //right

    this.walls.create(50, 10, "wallH"); //top left
    this.walls.create(450, 10, "wallH"); //top right
    this.walls.create(50, 330, "wallH"); //bottom left
    this.walls.create(450, 330, "wallH"); //bottom right

    this.walls.create(0, 170, "wallH"); //middle left
    this.walls.create(500, 170, "wallH"); //middle right
    this.walls.create(300, 259, "wallH");
    this.walls.create(250, 90, "wallH"); //middle top
    this.walls.create(50, 10, "wallH"); //middle bottom
  }


  // get points for grabbing coin
  takeCoin() {
    // this.coin.destroy() would alternatly remove the coin instead of moving it
    // this would make the coins be so random that they may end up inside the walls
    // // compute two random numbers ----
    //     var newX = Phaser.Math.RND.between(0,500);
    //     var newY = Phaser.Math.RND.between(0,340);
    //     // set the new coin position ---
    //     this.coin.setPosition(newX, newY);
  }

  updateCoinPosition() {
    let positions = [
      { x: 140, y: 60 },
      { x: 360, y: 60 },
      { x: 60, y: 140 },
      { x: 440, y: 140 },
      { x: 130, y: 300 },
      { x: 370, y: 300 },
    ];

    positions = positions.filter((coin) => coin.x !== this.coin.x);
    let newPosition = Phaser.Math.RND.pick(positions);
    this.coin.setPosition(newPosition.x, newPosition.y);
  }
  takeCoin() {
    this.score += 5;
    this.scoreLabel.setText("score:" + this.score);

    this.updateCoinPosition();
  }
}

// this initializes Phaser.  There are a ton of optional parameters, here are a few main ones
let game = new Phaser.Game({
  width: 500, //width of game in pixels
  height: 340, //height of game in pixels
  backgroundColor: "#3498db", //background colour
  physics: { default: "arcade" }, //the physics engine to use
  parent: "game", //the id of the element that will contain the game
});

// add scene to the game
game.scene.add("main", Main);
// start the scene
game.scene.start("main");
