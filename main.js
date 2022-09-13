

let me;
let guests;
let shared;

function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "curs_rr", "main1");
  me = partyLoadMyShared({
    clickHistory: [],
    color: color(random(255), random(255), random(255)).toString(),

  });
  guests = partyLoadGuestShareds();
  shared = partyLoadShared("shared");
}

function setup() {
  createCanvas(600, 600);
  noStroke();

  textAlign(CENTER, CENTER);
  frameRate(60);

  if (partyIsHost()) {
    partySetShared(shared,{  
      timer: 30 });
  }
}

function mousePressed(e) {
  me.x = mouseX;
  me.y = mouseY;
  me.clickHistory.push({x: me.x, y:me.y});
}

function draw() {
  background("#f5f5f5");

  if (partyIsHost()) {
    if (frameCount % 60 === 0) {
      shared.timer--;
    }
    if (shared.timer === 0) {
      partySetShared(shared,{
      timer: 30 });
      for (let i = 0; i < guests.length; i++) {
        guests[i].clickHistory = []
      }
      me.clickHistory = [];
    }
  }


  for (let i = 0; i < guests.length; i++) {
    for (const p of guests[i].clickHistory) {
      fill(guests[i].color);
      ellipse(p.x, p.y, 300, 300);
    }
  }


  // draw this guests dots
  for (const p of me.clickHistory) {
    fill(me.color);
    ellipse(p.x, p.y, 100, 100);
  }

  fill("orange");
  textSize(30);
  text(shared.timer, width / 2, 40);
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


