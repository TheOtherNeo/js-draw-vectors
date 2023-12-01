/**
JS Draw Vectors

Contains a set of functiions useful for drawing to the canvas object.
 
Crated by Neil Bezuidenhout
20 November 2023
*/

// Global variables will be defined with all caps
let VECTORS = [];

class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    static displayName = "Point";
    static distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
  
      return Math.hypot(dx, dy);
    }
  }

class Line {

    // Invert all y values.
    static invert_y = true;

    // These are the allowed dash style names.
    static linestyles = {
        solid: [],
        dotted: [1,3],
        dashed: [4,4],
        dashdot: [4,2,1,2],
    }

    constructor({label, start, end, color = "black", width = 1, dash ="solid", cap = "round"}) {
        this.label = label;
        this.start = new Point(start);
        this.end = new Point(end);
        this.color = color;
        this.width = width;
        this.dash = dash;
        this.cap = cap;
    }

    // Draw a line on the canvas in x,y start to x,y end coordinates
    draw_line(context) {

        // start a new path
        context.beginPath();
        // set the line dash pattern
        context.setLineDash(this.linestyles[this.dash]);

        // Use a Conditional (ternary) operator to swap between regular and inverted y
        // place the cursor from the point the line should be started
        context.moveTo(this.start.x, this.invert_y ? -this.start.y : this.start.y);
        // draw a line from current cursor position to the provided x,y coordinate
        context.lineTo(this.end.x, this.invert_y ? -this.end.y : this.end.y);

        // set stroke Color
        context.strokeStyle = this.color;
        // set stroke Width
        context.lineWidth = this.width;
        // set stroke Cap
        context.lineCap = this.cap;
        // add stroke to the line
        context.stroke();
    }

    // Draw text on the canvas at the x and y coordinates
    draw_text(context) {
        
        // Use a conditional (ternary) operator to change the alignment of text based on the active quadrant
        // The default value is start.
        context.textAlign = this.end.x > 0 ? "left" : "right";
        context.textBaseline = this.invert_y ? this.end.y > 0 ? "bottom" : "top" : this.end.y > 0 ? "top" : "bottom";
        // The default font is 10px sans-serif.
        context.font = "5px sans-serif"; 
        context.fillStyle = this.color;
        context.fillText(this.label, this.end.x, this.invert_y ? -this.end.y : this.end.y);
    }

    draw(context) {
        this.draw_line(context);
        this.draw_text(context);
    }
}

function addEventListeners(CANVAS){
    // For mouse events
     CANVAS.addEventListener("mousedown", (event) => {console.log(event)});
    // For touch events

}

function draw_axis({context, translatePos}) {
    draw_line({context: context, start: {x: -translatePos.x, y: 0}, end: {x: translatePos.x, y: 0}, color: "gray"});
    draw_line({context: context, start: {x: 0, y: -translatePos.y}, end: {x: 0 , y: translatePos.y}, color: "gray"});

    // Create tick marks on the x-axis
    for (let i = -translatePos.x; i < translatePos.x; i += 10 ) {
        if (i === 0) { continue; }  // Skip zero
        draw_line({context: context, start: {x: i, y: -1}, end: {x: i, y: 0}, color: "gray"});
        draw_text({context: context, position: {x: i, y: -2}, text: i, color: "gray"});
    }

    // Create tick marks on the y-axis
    for (let i = -translatePos.y; i < translatePos.y; i += 10 ) {
        if (i === 0) { continue; } // Skip zero
        draw_line({context: context, start: {x: -1, y: i}, end: {x: 0, y: i}, color: "gray"});
        draw_text({context: context, position: {x: -2, y: i}, text: i, color: "gray"});
    }
}

function plot_graph({canvas, data, scale = 1, translatePos}) {
    let context = canvas.getContext("2d");

    addEventListeners(canvas);

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Save the current state of the canvas translations.
    context.save();

    // Shift the centre point of the canvas
    context.translate(translatePos.x, translatePos.y);

    // Adjust the scaling based on the zoom slider
    context.scale(scale, scale);

    // Draw the axis lines on the canvas
    draw_axis({context: context, translatePos: translatePos});

    // Draw the blocks on the canvas
    for(let i=0; i<VECTORS.length; i++){
        VECTORS[i].draw(context);
    }

    context.restore();
}
