let bg;
let me;
let guests;

// let colorPicker = document.getElementById("fontcolor");

function preload(){
    partyConnect("wss://deepstream-server-1.herokuapp.com", "rr_flower-painter", "main1");
    me = partyLoadMyShared({ 
        
        clickHistory: [],
        color: "red",
    });
    guests = partyLoadGuestShareds();
}

function setup() {
//   bg = loadImage('assets/flower.jpg');
  createCanvas(800, 800);

  button = select("#save-image");
  button.mousePressed(saveJPG);
    
}

function draw() {
  background("white");
  noStroke();

  getColor();

    // draw each guests cursor
    for (let i = 0; i < guests.length; i++) {
        for (const p of guests) {
        fill(guests[i].color);
        ellipse(p.x, p.y, 60, 60);
        }
    }
    
      // mark this guests cursor
      fill(me.color);
      ellipse(me.x, me.y, 60, 60);

    // draw this guests clicks
    for (let i = 0; i < guests.length; i++) {
        for (const p of guests[i].clickHistory) {
          fill(guests[i].color);
          ellipse(p.x, p.y, 70, 70);
        }
    }

    // // draw this guests clicks
    // for (const p of me.clickHistory) {
    //     fill(me.color);
    //     ellipse(p.x, p.y, 80, 80);
    //   }
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

function getColor(){
    me.color = document.getElementById("fontcolor").value.toString();
}

function saveJPG() {
    console.log("saving")
     save();
     console.log("saved...?") 
    
  } 

