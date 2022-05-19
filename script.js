let viewCanvas = document.getElementById("viewCanvas");
let viewCanvasCTX = viewCanvas.getContext("2d");
let positive = document.getElementById("positive");
let negative = document.getElementById("negative");
let particles = [];
let magneticFields = [];
console.log("test")
class particle {
  constructor(x,y,width, height, mass, charge,xVelocity,yVelocity) {
    this.x = x;
    this.y = y;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.width = width;
    this.height = height;
    this.mass = mass;
    this.charge = charge;
    this.inMagneticField = [];
    this.inElectricField = false;
    this.image;
    if (this.charge>0) {
      this.image = positive;
    } else {
      this.image = negative;
    }
  }
}

class magneticField {
  constructor(x,y,width,height,strength) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.strength = strength;
  }
}

class electricField {
  constructor(x,y,width,height,strength,direction) {
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.strength=strength;
    this.direction=direction;
  }
}
function Start() {
  
  let particle1 = new particle(0,300,30,30,100,-1,5,8);
  let particle2 = new particle(0,300,30,30,100,0.5,5,-17);

  particles.push(particle1);
  particles.push(particle2);
  let magneticField1 = new magneticField(200,100,100,350,10);
  let magneticField2 = new magneticField(400,100,100,350,10);
  magneticFields.push(magneticField1,magneticField2);
  let electricField1 = new electricField(0,200,viewCanvas.width,150,30,1);
  requestAnimationFrame(function() {
    Update(particles,magneticFields,electricField1,performance.now());
  });
}
function Update(particles,magneticFields, electricField1,lastTime) {
  currentTime = performance.now()
  deltaTime = (currentTime - lastTime)/40;
  viewCanvasCTX.fillStyle = "#808080";
  viewCanvasCTX.globalAlpha = 0.07;
  viewCanvasCTX.fillRect(0, 0, viewCanvas.width, viewCanvas.height)
  viewCanvasCTX.globalAlpha = 1;
  ClearCanvas();

  viewCanvasCTX.fillStyle = "#FF0000";
  viewCanvasCTX.globalAlpha = 0.07;
  for (let i=0; i<magneticFields.length;i++) {
    viewCanvasCTX.fillRect(magneticFields[i].x, viewCanvas.height-magneticFields[i].height-magneticFields[i].y, magneticFields[i].width, magneticFields[i].height)
  }
  
  viewCanvasCTX.globalAlpha = 1;

  viewCanvasCTX.fillStyle = "#FFF000";
  viewCanvasCTX.globalAlpha = 0.07;
  viewCanvasCTX.fillRect(electricField1.x, viewCanvas.height-electricField1.height-electricField1.y, electricField1.width, electricField1.height)
  
  for (let i = 0; i < particles.length; i++) { 
    
    particles[i].inMagneticField = DetectCollision(particles[i],magneticFields)
    //particles[i].inElectricField = DetectCollision(particles[i],electricField1)
    particles[i] = wallCollision(particles[i])
    particles[i] = UpdateVelocities(particles[i],magneticFields,electricField1,deltaTime);
  
    viewCanvasCTX.globalAlpha = 1;

    viewCanvasCTX.fillStyle = "#000000";
    viewCanvasCTX.drawImage(particles[i].image,particles[i].x, viewCanvas.height-particles[i].height-particles[i].y, particles[i].width, particles[i].height)
    
    particles[i].x+=particles[i].xVelocity*deltaTime;
    particles[i].y+=particles[i].yVelocity*deltaTime;
    
  }

  
  

  
  requestAnimationFrame(function() {
    Update(particles,magneticFields, electricField1,currentTime);
  });//*/
}

function ClearCanvas() {
    viewCanvasCTX.clearRect(0, 0, this.viewCanvas.width, this.viewCanvas.height);
}

function DetectCollision(object1,object2) {

  let collisions = [];

  for (let i = 0; i < object2.length; i++) { 
    
    //if statement crashing
    if (object1.x + object1.width >= object2[i].x && object1.x + object1.width <= object2[i].width+object2[i].x && object1.y + object1.height >= object2[i].y && object1.y <= object2[i].y + object2[i].height) {

      collisions.push(object2[i])
      
    } 
    
    
  }
  
  
  return collisions;
}
function UpdateVelocities(particle1, magneticFields,electricField1,deltaTime) {
  
  for (let j=0;j<particle1.inMagneticField.length;j++) {
  
    for (let i = 0; i < 200; i++) { 
      let temp1 = (((particle1.yVelocity)/200)*particle1.inMagneticField[j].strength * -particle1.charge)/particle1.mass;
      let temp2 = (((-particle1.xVelocity)/200)*particle1.inMagneticField[j].strength * -particle1.charge)/particle1.mass;
  
      particle1.xVelocity+=temp1*deltaTime 
      particle1.yVelocity+=temp2 *deltaTime
     }
  }
  if (particle1.inElectricField) {
    if (electricField1.direction==1) {
      particle1.yVelocity += (electricField1.strength * particle1.charge)/particle1.mass;
    } else if (electricField1.direction==2) {
      particle1.yVelocity -= (electricField1.strength * particle1.charge)/particle1.mass;
    } else if (electricField1.direction==3) {
      particle1.xVelocity += (electricField1.strength * particle1.charge)/particle1.mass;
    } else if (electricField1.direction==4) {
      particle1.xVelocity -= (electricField1.strength * particle1.charge)/particle1.mass;
    }
    
  }

  return particle1
}

function wallCollision(particle1) {
  if (particle1.y<=0 || particle1.y>=viewCanvas.height) {
    
    particle1.yVelocity=particle1.yVelocity*-1;
  }

  if (particle1.x<=0 || particle1.x>=viewCanvas.width) {
    particle1.xVelocity=particle1.xVelocity*-1;
  }
  return particle1
}
Start();