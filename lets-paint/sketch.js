
const colorInput = document.getElementById('color');
const weight = document.getElementById('weight');
const clear = document.getElementById('clear');
let output = document.getElementById("size");
let currentPath = [];

weight.oninput = function() {
  output.innerHTML = this.value;
}

function preload(){
    partyConnect("wss://deepstream-server-1.herokuapp.com", "rr_flower-painter_v2", "main1");
    me = partyLoadMyShared({ 
        currentPath: [],
    });

    guests = partyLoadGuestShareds();
    shared = partyLoadShared("shared");
    bg = loadImage('assets/flower.png');
}

function setup() {
  createCanvas(500, 700);

  button = select("#save-image");
  button.mousePressed(saveJPG);

  button2 = select("#clear-button");
  button2.mousePressed(clearPad);

  button3 = select("#StartButton");
  button3.mousePressed(toInstructions);

  button4 = select("#NextPage");
  button4.mousePressed(nextPage);

 if (partyIsHost()){
   shared.paths = []
 }
    
}

function draw() {
  background("white")
  noStroke();
  

  shared.paths.forEach(path => {
    path.forEach(point => {
      fill(point.color);
      ellipse(point.x, point.y, point.weight, point.weight);
    });
  });

  background(bg);
}


function mousePressed() {
  const point = {
    x: mouseX,
    y: mouseY,
    color: colorInput.value,
    weight: weight.value
  };
  me.currentPath.push(point);

  me.currentPath = [];
  shared.paths.push(me.currentPath);
}

function saveJPG() {
  console.log("saving")
   save();
   console.log("saved...?") 
  
}

function clearPad(){
  shared.paths.splice(0);
  background(255);
  console.log("test")
}
  
function toInstructions(){
  startscreen = select(".startscreen");
  startscreen.style('display', "none")
}

function nextPage(){
  instructions = select(".instructions");
  instructions.style('display', "none")

  canvas = select(".content")
  canvas.style("display", "flex");
}



