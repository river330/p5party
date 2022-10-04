let shared, my, guests;

function preload() {
  // connect to the party server
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "sheep_eat",
    "main"
  );

  shared = partyLoadShared("shared", { 
    grid: [],
    eaten: 0,
    gameMode: 0,
    timer: 0, 
  });
  me = partyLoadMyShared();
  guests = partyLoadGuestShareds();
}

function setup() {
  partyToggleInfo(true);
  createCanvas(800, 900);

  console.log("partyIsHost()", partyIsHost());
  me.sheep = { x: 0 , y: 0};
  console.log(me.sheep)

  if (partyIsHost()) {
    console.log("i'm host, init the grid");
    shared.eaten = 0;
    shared.timer = 90;
    setInterval(timerFunc, 1000);
    shared.gameMode = 0;
    shared.grid = [];

    for (let col = 0; col < 20; col++) {
      shared.grid[col] = [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ];
    }
  }
}

function draw() {
  switch (shared.gameMode) {
    case 0:
      startingScreen();
      break;
    case 1:
      instructScreen();
      break;
    case 2:
      gameOn();
  }
}


function startingScreen() {
  createCanvas(900, 900);
  background("#add8e6");
  fill('white');
  textStyle(BOLD);
  textSize(50);
  textAlign(CENTER);
  text("Welcome to", 450, 200);
  text("BAH BAH GRASS", 450, 260);
  textSize(30);
  text("Click anywhere to continue", 450, 380);
  

}


function instructScreen() {
  createCanvas(900, 900);
  background("#d8e6ad");
  fill('black');
  textStyle(BOLD);
  textSize(30);
  textAlign(CENTER);
  text("Using the A, S, W, D keys, move your sheep", 450, 200);
  text("along the grass grid to eat the grass.", 450, 230);
  text("Goal of the game is to eat all the grass", 450, 270);
  text("before the time in the bottom right finishes", 450, 300);
  text("Click anywhere to continue", 450, 380);
  
}

function mousePressed() {
  if (shared.gameMode == 0) {
    shared.gameMode = 1;
  } else if (shared.gameMode == 1){
    shared.gameMode = 2;
  }
}

function gameOver() {
  if (shared.eaten === 400) {
    createCanvas(900, 900);
    background("#5C3E2A");
    fill('white');
    textStyle(CENTER);
    textStyle(BOLD);
    textSize(50);
    text("Congratulations! You WIN!", 450, 200);
  } 
  if (outOfTime == true) {
    createCanvas(900, 900);
    background("#5C3E2A");
    textStyle(CENTER);
    fill('white');
    textStyle(BOLD);
    textSize(50);
    text("You're out of time... You LOSE!", 450, 200);
  }
}


function gameOn() {
  textAlign(LEFT);
  textStyle(NORMAL);
  createCanvas(900, 900);
  background("#5C3E2A");
  fill("red");
  noStroke();
  angleMode(DEGREES)

  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 20; col++) {
      const x = col * 40 + 1;
      const y = row * 40 + 1;
    //   //   console.log(col, row);
      if (shared.grid[col][row]) {
        fill("#27F379");
        rect(x+50, y+50, 40 - 2, 40 - 2);
      }
    }
  }
  drawSheep();
  // getAmount();

  fill("white");
  textSize(20);
  text("Grass eaten: " + shared.eaten, 20, 880);
  countDown();

  //if winner(gridSize *2 or timer runs out):
  // if (shared.eaten == gridSize*gridSize) {
  //   won = true;
  //   shared.gameMode = 3;
  // }
}



function keyPressed() {
  if (keyCode === 87) {
        me.sheep.y = me.sheep.y - 1;
        console.log(me.sheep)

    }
    if (keyCode === 83) {
        me.sheep.y = me.sheep.y + 1;
        console.log(me.sheep)
    }
    if (keyCode === 65) {
        me.sheep.x = me.sheep.x - 1;
        console.log(me.sheep)
    }
    if (keyCode === 68) {
        me.sheep.x = me.sheep.x + 1;
        console.log(me.sheep)
    }

    let col = me.sheep.x;
    let row = me.sheep.y;
    constrain(col, 0, 19);
    constrain(row, 0, 19);
    if (shared.grid[col][row] === false) {
    } else {
        shared.grid[col][row] = false;
    }
    getTotal();
};

function drawSheep(){
    push();


    for (const p of guests) {
        fill("gray");
        rect(p.sheep.x * 40 + 51, p.sheep.y * 40 + 51, 40 - 2, 40 - 2);
        fill("black");
    rect(p.sheep.x * 40 + 59, p.sheep.y * 40 + 79, 25 - 2, 25 - 2);
    fill("black");
    rect(p.sheep.x * 40 + 53, p.sheep.y * 40 + 82, 10 - 2, 10 - 2);
    rect(p.sheep.x * 40 + 79, p.sheep.y * 40 + 82, 10 - 2, 10 - 2);

      }

    fill("#F3F3F3");
    rect(me.sheep.x * 40 + 51, me.sheep.y * 40 + 51, 40 - 2, 40 - 2);
    fill("black");
    rect(me.sheep.x * 40 + 59, me.sheep.y * 40 + 79, 25 - 2, 25 - 2);
    fill("black");
    rect(me.sheep.x * 40 + 53, me.sheep.y * 40 + 82, 10 - 2, 10 - 2);
    rect(me.sheep.x * 40 + 79, me.sheep.y * 40 + 82, 10 - 2, 10 - 2);
    // console.log("sheep is drawn");

}

function timerFunc() {
  if (shared.timer > 0) {
    shared.timer--;
  }
}


function countDown() {
  if (shared.timer / 60 >= 1) {
    timerValue_new = shared.timer - 60;
    if (timerValue_new < 10) {
      text("1:0" + timerValue_new, 840, 880);
    } else {
      text("1:" + timerValue_new, 840, 880);
    }
  } else {
    if (shared.timer >= 60) {
      text("1:" + shared.timer, 840, 880);
    }
    if (shared.timer >= 10) {
      text("0:" + shared.timer, 840, 880);
    }
    if (shared.timer < 10) {
      text("0:0" + shared.timer,840, 880);
    }
    if (shared.timer == 0) {
      console.log("game over");
      outOfTime = true;
      gameOver();
    }
  }
}

function getTotal(){
  shared.eaten = 0

  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 20; col++) {
       if (shared.grid[col][row] === false){ 
        shared.eaten++; // add one to the counter
      }
    }
  }
}





