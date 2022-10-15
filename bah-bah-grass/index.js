let shared;
let me;
let guests;

let nom;

let shared_time;
let shared_state;
let shared_farmer;
let gameState = "TITLE";

let gridSize = 20;


function preload() {
    partyConnect(
        "wss://deepstream-server-1.herokuapp.com",
        "randrivera_bah-bah-grass_beta",
        "main"
    );
    shared = partyLoadShared("shared", {
        grid: [],
        eaten: 0,
    });

    me = partyLoadMyShared({role: "observer"});
    guests = partyLoadGuestShareds();

    shared_time = partyLoadShared("shared_time");
    
    shared_farmer = partyLoadShared("shared_farmer", {
        farmerTimer : 10,
        posX: 19,
        posY: 7,
        madeIt: false,
    });
    

    sheep = loadImage("./assets/sheep.png");
    black_sheep = loadImage("./assets/black_sheep.png");
    grass = loadImage("./assets/grass.png");
    logo = loadImage("./assets/bahbahgrass_logo.png");
    grass_start = loadImage("./assets/grass_starter.png");
    grass_instruct = loadImage("./assets/grass_instruction.png")
    farmer = loadImage("./assets/farmer.png");

    nom = loadSound("./assets/nom_noise.wav");
}


function setup(){
    nom.setVolume(0.1);
    partyToggleInfo(true);

    if (partyIsHost()) {
        resetGrid();
        partySetShared(shared_time, { gameTimer: 90 });
    }
    // different starting position for each player
    for (i=0; i<guests.length; i++) {
        me.sheep = { posX: i*20, posY: 0 };
    }  
}

function draw() {
  if (gameState === "TITLE") {
    startingScreen();
  }
  if (gameState === "INSTRUCTIONS") {
    instructScreen();
  }
  if (gameState === "PLAYING"){
    gameOn();
  }

  if (gameState === "GAMEOVER"){
    gameOver();
  }
}

function mousePressed() {
  if (gameState === "TITLE") {
    gameState = "INSTRUCTIONS";
    return;
  }
  if (gameState === "INSTRUCTIONS") {
     gameState = "PLAYING";
     return;
  }
}

function startingScreen() {
    createCanvas(600, 600);
    background("#99ccff");
    fill('#703e14');
    push();
    textSize(35);
    pop();
    push();
    image(logo, 43, 100, 520, 260);
    image(grass_start, 0, 0, 600, 600);
    textSize(20);
    textAlign(CENTER, CENTER);
    testing = text("Click anywhere to continue", 300, 350);
    pop();
}

function instructScreen() {
    createCanvas(600, 600);
    background("#99ccff");
    fill('#703e14');
    image(logo, 220, 19, 160, 80);
    image(grass_instruct, 0, 0, 600, 600);
    push();
    textSize(35);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("Instructions", 300, 150);
    pop();
    textSize(25);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    text("Eat all grass squares with", 300, 200);
    text("your teammates before", 300, 240);
    text("the time runs out.", 300, 280);
    push();
    pop();
    push();
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Click anywhere to continue", 300, 340);
    pop();

}

function gameOn() {
    createCanvas(600, 600);
    background('beige');
    image(logo, 220, 19, 160, 80);
    translate(90,100);
    assignPlayers();
    drawGrid();
    drawSheep();
    gameTimer();
    drawUI();

    replantingGrass();

    if (shared.eaten == gridSize * gridSize - 1) {
        shared_state = true;
        console.log("Game over: all grass eaten, you win");
        gameState = "GAMEOVER"
    } else {
        shared_state = false;
    }

}

function gameOver() {
    textFont('Pixeloid Sans');
    textAlign(CENTER, CENTER);
    if (shared_state === true) {
        createCanvas(600, 600);
        background("#99ccff");
        fill('#703e14');
        image(logo, 220, 19, 160, 80);
        textSize(20);
        text("Congratulations!", 300, 200);
        textSize(30);
        text("You WIN!", 300, 240);
    }
    if (shared_state === false) {
        createCanvas(600, 600);
        background("#99ccff");
        fill('#703e14');
        image(grass_start, 0, 0, 600, 600);
        image(logo, 220, 19, 160, 80);
        textSize(20);
        text("You're out of time...", 300, 200);
        textSize(30);
        text("You LOSE!", 300, 240);
    }
}

function assignPlayers() {
    // if there isn't a player1
    if (!guests.find((p) => p.role === "player1")) {
        // console.log("need player1");
        // find the first observer
        const o = guests.find((p) => p.role === "observer");
        // console.log("found first observer", o, me, o === me);
        // if thats me, take the role
        if (o === me) o.role = "player1";
    }
    if (!guests.find((p) => p.role === "player2")) {
        const o = guests.find((p) => p.role === "observer");
        if (o === me) o.role = "player2";
    }
}

function drawGrid() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const x = col * gridSize;
            const y = row * gridSize;
            stroke('#94541E');
            if (shared.grid[col][row] === "planted") {
                fill('#0F3325'); //green
                rect(x, y , gridSize, gridSize);
                image(
                    grass,
                    x,
                    y,
                    gridSize,
                    gridSize
                );
            } else if (shared.grid[col][row] === "replanted") {
                // fill('#FFD700');
                fill('orange');
                rect(x , y , gridSize, gridSize);
            } else {
                fill('#94541E');
                rect(x , y , gridSize, gridSize);
            }
        }
    }
}

function gameTimer() {
    if (partyIsHost()) {
        if (frameCount % 60 === 0) {
            shared_time.gameTimer--;
        }
    
        if (shared_time.gameTimer === 0) {
            console.log("Game Over: timer ran out");
            gameOver();
            
        }
    }
}

function replantingGrass() {
  const x = shared_farmer.posX * gridSize;
  const y = shared_farmer.posY * gridSize;
  
  // a little glitchy for the player that is not the host but for the most part works

  // if anyone gets to yellow spot:
  const p1 = guests.find((p) => p.role === "player1");
  const p2 = guests.find((p) => p.role === "player2");

  if ((shared_time.gameTimer <= 85 && shared_time.gameTimer > 75) ||
      (shared_time.gameTimer <= 65 && shared_time.gameTimer > 55)) {
      image(farmer, 400, 0, 50, 50);
      shared.grid[shared_farmer.posX][shared_farmer.posY] = "replanted";
      if(partyIsHost()) {
          if (frameCount % 60 === 0) {
              shared_farmer.farmerTimer--;
          }
      }
      if ((p1 === me) || (p2 === me)) {
          if ((me.sheep.posX === x && me.sheep.posY === y)) {
              shared_farmer.madeIt = true;
          }
      }

      if (shared_farmer.farmerTimer === 0) {
          if (shared_farmer.madeIt === false) {
              console.log("Didn't get seed in time")
              for (i = 0; i < gridSize; i++) {
                  shared.grid[i][shared_farmer.posY] = "planted";
              }
          }
      }
      
      if (shared_farmer.madeIt === true) {
          console.log("You got to seed in time!")
          shared.grid[shared_farmer.posX][shared_farmer.posY] = "unplanted";
      }

      text(shared_farmer.farmerTimer, 425,70);
  } else {
      partySetShared(shared_farmer, {
          farmerTimer : 10,
          posX: 6,
          posY: 18,
          madeIt: false
      });
  }
}

function drawUI() {
    fill("black");
    textSize(15);
    text(me.role, 25,420);
    text("Grass eaten: " + shared.eaten, 50, 440);
    text(shared_time.gameTimer, 390, 420);
}

function keyPressed() {
    const p1 = guests.find((p) => p.role === "player1");
    const p2 = guests.find((p) => p.role === "player2");


    if (gameState === "PLAYING"){
      if ((p1 === me) || (p2 === me)) {
          nom.play();
          if ((keyCode === DOWN_ARROW) || (keyCode === 83)) {
              me.direction = "down";
              tryMove(0, gridSize);
          }
          if ((keyCode === UP_ARROW) || (keyCode === 87)) {
              me.direction = "up";
              tryMove(0, -gridSize);
          }
          if ((keyCode === LEFT_ARROW) || (keyCode === 65)) {
              me.direction = "left";
              tryMove(-gridSize, 0);
          }
          if ((keyCode === RIGHT_ARROW) || (keyCode === 68)) {
              me.direction = "right";
              tryMove(gridSize, 0);
          }
      
          let col = me.sheep.posX / gridSize;
          let row = me.sheep.posY / gridSize;
          
          if (shared.grid[col][row] === "planted") { //planted
              shared.grid[col][row] = "unplanted";
              shared.eaten = shared.eaten + 1;
          } 
      }
    }
}


function resetGrid() {
    const newGrid = [];
    for (let col = 0; col < gridSize; col++) {
        newGrid[col] = new Array(gridSize).fill("planted");
    }
    shared.grid = newGrid;
}

function tryMove(x, y) {

  const targetLocation = { x: me.sheep.posX + x, y: me.sheep.posY + y };
  const bounds = { x: 0, y: 0, w: gridSize*19, h: gridSize*19};
  if (!pointInRect(targetLocation, bounds)) {
    return;
  }

  me.sheep.posX += x;
  me.sheep.posY += y;
}

function drawSheep() {
  //draw sheep for player 1
  translate(10,10);
  const p1 = guests.find((p) => p.role === "player1");
  if (p1) {
      push();
      translate(p1.sheep.posX, p1.sheep.posY);
      rotateSheep(p1);
      imageMode(CENTER);
      image(
          sheep,
          0,
          0,
          gridSize + 15,
          gridSize + 15
      );
      pop();
      }
  //draw sheep for player 2
  const p2 = guests.find((p) => p.role === "player2");
  if (p2) {
      push();
      translate(p2.sheep.posX, p2.sheep.posY);
      rotateSheep(p2);
      imageMode(CENTER);
      image(
          black_sheep,
          0,
          0,
          gridSize + 15,
          gridSize + 15
      );
      pop();
  }
}

function rotateSheep(test) {
  if (test.direction === "left") rotate(PI/180 * 90);
  if (test.direction === "right") rotate(PI/180 * -90);
  if (test.direction === "up") rotate(PI/180 * 180);
}

function pointInRect(p, r) {
  return (
    p.x >= r.x && // format wrapped
    p.x <= r.x + r.w &&
    p.y >= r.y &&
    p.y <= r.y + r.h
  );
}
