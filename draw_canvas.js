/**
JS Draw Vectors

Contains a set of functiions useful for drawing to the canvas object.
 
Crated by Neil Bezuidenhout
20 November 2023
*/

function setup_canvas() {
    // Set up the canvas for drawings
    var canvas = document.getElementById("negative_phase_sequence");

    window.translatePos = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    window.scale = 1.0;
    var scaleMultiplier = 0.8;
    var startDragOffset = {};
    var mouseDown = false;
}

// Draw a line on the canvas in x,y start to x,y end coordinates
function draw_line({context, start, end, color = 'black', dash = "solid", width = 1, cap = "round", invert_y = true, }) {

    // These are the allowed dash style names.
    const linestyles = {
        solid: [],
        dotted: [1,3],
        dashed: [4,4],
        dashdot: [4,2,1,2],
    }

    // start a new path
    context.beginPath();
    // set the line dash pattern
    context.setLineDash(linestyles[dash]);

    // Use a Conditional (ternary) operator to swap between regular and inverted y
    // place the cursor from the point the line should be started
    context.moveTo(start.x, invert_y ? -start.y : start.y);
    // draw a line from current cursor position to the provided x,y coordinate
    context.lineTo(end.x, invert_y ? -end.y : end.y);

    // set stroke Color
    context.strokeStyle = color;
    // set stroke Width
    context.lineWidth = width;
    // set stroke Cap
    context.lineCap = cap;
    // add stroke to the line
    context.stroke();
}

// Draw text on the canvas at the x and y coordinates
function draw_text({context, position, text, color = 'black', invert_y = true, }) {
    
    // Use a conditional (ternary) operator to change the alignment of text based on the active quadrant
    // The default value is start.
    context.textAlign = position.x > 0 ? "left" : "right";
    context.textBaseline = invert_y ? position.y > 0 ? "bottom" : "top" : position.y > 0 ? "top" : "bottom";
    // The default font is 10px sans-serif.
    context.font = "5px sans-serif"; 
    context.fillStyle = color;
    context.fillText(text, position.x, invert_y ? -position.y : position.y);
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

function plot_graph({scale = 1, translatePos}) {
    var canvas = document.getElementById("negative_phase_sequence");
    var context = canvas.getContext("2d");

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

    for (const [key, value] of Object.entries(vectors)) {

        // Draw Line
        draw_line({
            context: context,
            start: {x: value.start.x, y: value.start.y},
            end: {x: value.end.x, y: value.end.y},
            color: value.color,
            dash: value.dash,
        });

        // Draw text
        draw_text({
            context: context,
            position: {x: value.end.x, y: value.end.y},
            text: value.label,
            color: value.color,
        });
    }
    context.restore();
}
