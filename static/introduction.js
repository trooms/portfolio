console.clear();
console.log("Building introduction canvas");

// Get the canvas element from the DOM
const canvas = document.getElementById('introduction');

// Get the canvas dimensions
let width = canvas.offsetWidth; // Width of the scene
let height = canvas.offsetHeight; // Height of the scene

// Store the 2D context
const ctx = canvas.getContext('2d');

// Function called right after user resized its screen
function onResize () {
  // We need to define the dimensions of the canvas to our canvas element
  // Javascript doesn't know the computed dimensions from CSS so we need to do it manually
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  
  // If the screen device has a pixel ratio over 1
  // We render the canvas twice bigger to make it sharper (e.g. Retina iPhone)
  if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
  } else {
    canvas.width = width;
    canvas.height = height;
  }
}

// Listen to resize events
window.addEventListener('resize', onResize);
// Make sure the canvas size is perfect
onResize();

let PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
let PROJECTION_CENTER_X = width / 2; // x center of the canvas
let PROJECTION_CENTER_Y = height / 2; // y center of the canvas
const dots = []; // Store every particle in this array

class Dot {
  constructor() {
    this.x = (Math.random() - 0.5) * width; // Give a random x position
    this.y = (Math.random() - 0.5) * height; // Give a random y position
    this.z = Math.random() * width; // Give a random z position
    this.radius = 10; // Size of our element in the 3D world
    
    this.xProjected = 0; // x coordinate on the 2D world
    this.yProjected = 0; // y coordinate on the 2D world
    this.scaleProjected = 0; // Scale of the element on the 2D world (further = smaller)
  }
  // Project our element from its 3D world to the 2D canvas
  project() {
    // The scaleProjected will store the scale of the element based on its distance from the 'camera'
    this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
    // The xProjected is the x position on the 2D world
    this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
    // The yProjected is the y position on the 2D world
    this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
  }
  // Draw the dot on the canvas
  draw() {
    // We first calculate the projected values of our dot
    this.project();
    // We define the opacity of our element based on its distance
    ctx.globalAlpha = Math.abs(1 - this.z / width);
    // We draw a rectangle based on the projected coordinates and scale
    ctx.fillRect(this.xProjected - this.radius, this.yProjected - this.radius, this.radius * 2 * this.scaleProjected, this.radius * 2 * this.scaleProjected);
  }
}

// Create 800 new dots
for (let i = 0; i < 800; i++) {
  // Create a new dot and push it into the array
  dots.push(new Dot());
}

function render() {
  // Clear the scene from top left to bottom right
  ctx.clearRect(0, 0, width, height);
  
  // Loop through the dots array and draw every dot
  for (var i = 0; i < dots.length; i++) {
    dots[i].draw();
  }
}

  
  // Request the browser the call render once its ready for a new frame
  window.requestAnimationFrame(render);