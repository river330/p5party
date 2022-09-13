let bg;

function preload(){
    partyConnect("wss://deepstream-server-1.herokuapp.com", "rr_flower-painter", "main1");
    me = partyLoadMyShared({ 
        clickHistory: [],
        // color: color(random(255), random(255), random(255)).toString(),
    });
    guests = partyLoadGuestShareds();
}

function setup() {
//   bg = loadImage('assets/flower.jpg');
  createCanvas(800, 800);
}

function draw() {
  background("white");
  noStroke();

    // draw each guests cursor
    for (const p of guests) {
        fill("blue");
        ellipse(p.x, p.y, 30, 30);
      }
    
      // mark this guests cursor
      fill("blue");
      ellipse(me.x, me.y, 30, 30);

    // draw this guests clicks
    for (let i = 0; i < guests.length; i++) {
        for (const p of guests[i].clickHistory) {
          fill("yellow");
          ellipse(p.x, p.y, 50, 50);
        }
    }

    // draw this guests clicks
    for (const p of me.clickHistory) {
        fill("blue");
        ellipse(p.x, p.y, 50, 50);
      }
}


function mouseMoved(e) {
    me.x = mouseX;
    me.y = mouseY;
}

function mousePressed(e) {
    me.x = mouseX;
    me.y = mouseY;
    me.clickHistory.push({x: me.x, y:me.y});
}

function keyPressed() {
  // write shared data
  if (key === " ") {
    for (let i = 0; i < guests.length; i++) {
        guests[i].clickHistory = []
    }
    me.clickHistory = [];
    partySetShared(shared,{
      timer: 30 });
    return false;
  }
}
