let shared, my, guests;

function preload() {
  // connect to the party server
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "sheep_eat",
    "main"
  );

  shared = partyLoadShared("shared", { grid: [] });
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
        rect(x, y, 40 - 2, 40 - 2);
      }
    }
  }
  drawSheep();
//   getAmount();

  fill("white")
  textSize(30)
  text("XX/400", 20, 860);
}


document.addEventListener("keyup", function(e){ 
    if (e.code === 'KeyW') {
        me.sheep.y = me.sheep.y - 1;
        console.log(me.sheep)

    }
    if (e.code === 'KeyS') {
        me.sheep.y = me.sheep.y + 1;
        console.log(me.sheep)
    }
    if (e.code === 'KeyA') {
        me.sheep.x = me.sheep.x - 1;
        console.log(me.sheep)
    }
    if (e.code === 'KeyD') {
        me.sheep.x = me.sheep.x + 1;
        console.log(me.sheep)
    }

    let col = me.sheep.x;
    let row = me.sheep.y;
    constrain(col, 0, 19);
    constrain(row, 0, 19);
    if (shared.grid[col][row] === false) {
        // shared.grid[col][row] = true;
      } else {
        shared.grid[col][row] = false;
    }

    
    const count1 = shared.grid[col].filter(value => value === false).length;
    console.log(count1); // 👉️ 3

});

function drawSheep(){
    push();


    for (const p of guests) {
        fill("gray");
        rect(p.sheep.x * 40 + 1, p.sheep.y * 40 + 1, 40 - 2, 40 - 2);
        fill("black");
    rect(p.sheep.x * 40 + 9, p.sheep.y * 40 + 29, 25 - 2, 25 - 2);
    fill("black");
    rect(p.sheep.x * 40 + 3, p.sheep.y * 40 + 32, 10 - 2, 10 - 2);
    rect(p.sheep.x * 40 + 29, p.sheep.y * 40 + 32, 10 - 2, 10 - 2);

      }

    fill("#F3F3F3");
    rect(me.sheep.x * 40 + 1, me.sheep.y * 40 + 1, 40 - 2, 40 - 2);
    fill("black");
    rect(me.sheep.x * 40 + 9, me.sheep.y * 40 + 29, 25 - 2, 25 - 2);
    fill("black");
    rect(me.sheep.x * 40 + 3, me.sheep.y * 40 + 32, 10 - 2, 10 - 2);
    rect(me.sheep.x * 40 + 29, me.sheep.y * 40 + 32, 10 - 2, 10 - 2);
    // console.log("sheep is drawn");

}






