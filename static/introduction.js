if (!window.initCanvas) {
  window.initCanvas = function() {
    console.clear();

    // Get the canvas element from the DOM
    const canvas = document.getElementById('introduction');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // Store the 2D context
    const ctx = canvas.getContext('2d');

    if (window.devicePixelRatio > 1) {
      canvas.width = canvas.clientWidth * 2;
      canvas.height = canvas.clientHeight * 2;
      ctx.scale(2, 2);
    }

    /* ====================== */
    /* ====== VARIABLES ===== */
    /* ====================== */
    let width = canvas.offsetWidth; // Width of the canvas
    let height = canvas.offsetHeight; // Height of the canvas
    const dots = []; // Every dots in an array

    /* ====================== */
    /* ====== CONSTANTS ===== */
    /* ====================== */
    /* Some of those constants may change if the user resizes their screen but I still strongly believe they belong to the Constants part of the variables */
    const DOTS_AMOUNT = 1000; // Amount of dots on the screen
    const DOT_RADIUS = 10; // Radius of the dots
    let PROJECTION_CENTER_X = width / 2; // X center of the canvas HTML
    let PROJECTION_CENTER_Y = height / 2; // Y center of the canvas HTML
    let PERSPECTIVE = width * 0.8;

    class Dot {
      constructor() {
        this.x = (Math.random() - 0.5) * width; // Give a random x position
        this.y = (Math.random() - 0.5) * height; // Give a random y position
        this.z = Math.random() * width; // Give a random z position
        this.radius = 10; // Size of our element in the 3D world
        
        this.xProjected = 0;
        this.yProjected = 0;
        this.scaleProjected = 0;
        
        TweenMax.to(this, (Math.random() * 10 + 15), {
          z: width,
          repeat: -1,
          yoyo: true,
          ease: Power2.easeOut,
          yoyoEase: true,
          delay: Math.random() * -25
        });
      }
      // Do some math to project the 3D position into the 2D canvas
      project() {
        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
      }
      // Draw the dot on the canvas
      draw() {
        this.project();
        ctx.globalAlpha = Math.abs(1 - this.z / width);
        ctx.fillRect(this.xProjected - this.radius, this.yProjected - this.radius, this.radius * 2 * this.scaleProjected, this.radius * 2 * this.scaleProjected);
      }
    }

    function createDots() {
      // Empty the array of dots
      dots.length = 0;
      
      // Create a new dot based on the amount needed
      for (let i = 0; i < DOTS_AMOUNT; i++) {
        // Create a new dot and push it into the array
        dots.push(new Dot());
      }
    }

    /* ====================== */
    /* ======== RENDER ====== */
    /* ====================== */
    function render() {
      // Clear the scene
      ctx.clearRect(0, 0, width, height);
      
      // Loop through the dots array and draw every dot
      for (var i = 0; i < dots.length; i++) {
        dots[i].draw();
      }
      
      window.requestAnimationFrame(render);
    }


    // Function called after the user resized its screen
    function afterResize () {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      if (window.devicePixelRatio > 1) {
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        ctx.scale(2, 2);
      } else {
        canvas.width = width;
        canvas.height = height;
      }
      PROJECTION_CENTER_X = width / 2;
      PROJECTION_CENTER_Y = height / 2;
      PERSPECTIVE = width * 0.8;
      
      createDots(); // Reset all dots
    }

    // Variable used to store a timeout when user resized its screen
    let resizeTimeout;
    // Function called right after user resized its screen
    function onResize () {
      // Clear the timeout variable
      resizeTimeout = window.clearTimeout(resizeTimeout);
      // Store a new timeout to avoid calling afterResize for every resize event
      resizeTimeout = window.setTimeout(afterResize, 500);
    }
    window.addEventListener('resize', onResize);

    // Populate the dots array with random dots
    createDots();

    // Render the scene

    window.requestAnimationFrame(render);
  }
}