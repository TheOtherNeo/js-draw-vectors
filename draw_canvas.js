/**
JS Draw Vectors

Contains a set of functiions useful for drawing to the canvas object.
 
Crated by Neil Bezuidenhout
20 November 2023
*/


class DrawCanvas {

    // Invert all y values.
    static invert_y = true;

    font = "13px sans-serif"; 
    lineWidth = 1;
    lineCap = "round";
    static dash = "solid";

    // Draw a line on the canvas in x,y start to x,y end coordinates
    static #line({context, c, x1, y1, x2, y2, stroke="black", text}) {

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
        context.setLineDash(linestyles[this.dash]);

        // Use a Conditional (ternary) operator to swap between regular and inverted y
        // place the cursor from the point the line should be started
        context.moveTo(x1, this.invert_y ? -y1 : y1);
        // draw a line from current cursor position to the provided x,y coordinate
        context.lineTo(x2, this.invert_y ? -y2 : y2);

        // set stroke Color
        context.strokeStyle = stroke;
        // set stroke Width
        context.lineWidth = this.width;
        // set stroke Cap
        context.lineCap = this.cap;
        // add stroke to the line
        context.stroke();
    }

    // Draw text on the canvas at the x and y coordinates
    static #text({context, c, x, y, stroke="black", text}) {
        
        // Use a conditional (ternary) operator to change the alignment of text based on the active quadrant
        // The default value is start.
        context.textAlign = x > 0 ? "left" : "right";
        context.textBaseline = this.invert_y ? y > 0 ? "bottom" : "top" : y > 0 ? "top" : "bottom";
        // The default font is 10px sans-serif.
        context.font = this.font;
        context.fillStyle = stroke;
        context.fillText(text, x, this.invert_y ? -y : y);
    }

    // Draw a line on the canvas in x,y start to x,y end coordinates
    static line({context, c, v, translatePos}) {
        this.#line({context: context, c:c, x1:v.start.x, y1:v.start.y, x2:v.end.x, y2:v.end.y, text:v.label, stroke:v.stroke});
    }

    // Draw a line on the canvas in x,y start to x,y end coordinates
    static text({context, c, v, translatePos}) {
        this.#text({context: context, c:c, x:v.end.x, y:v.end.y, text:v.label, stroke:v.stroke});
    }

    static axis({context, translatePos}) {
        this.#line({context: context, x1: -translatePos.x, y1: 0, x2: translatePos.x, y2: 0, stroke: "gray"});
        this.#line({context: context, x1: 0, y1: -translatePos.y, x2: 0 , y2: translatePos.y, stroke: "gray"});

        // Create tick marks on the x-axis
        for (let i = -translatePos.x; i < translatePos.x; i += 25 ) {
            if (i === 0) { continue; }  // Skip zero
            this.#line({context: context, x1: i, y1: -1, x2: i, y2: 0, stroke: "gray"});
            this.#text({context: context, x: i, y: -2, text: i, stroke: "gray"});
        }

        // Create tick marks on the y-axis
        for (let i = -translatePos.y; i < translatePos.y; i += 25 ) {
            if (i === 0) { continue; } // Skip zero
            this.#line({context: context, x1: -1, y1: i, x2: 0, y2: i, stroke: "gray"});
            this.#text({context: context, x: -2, y: i, text: i, stroke: "gray"});
        }
    } //static #axis

    // Shorthand call to both functions
    static vector({context, key, value, translatePos}) {
        this.line({context:context, c:key, v:value, translatePos: translatePos});
        // Don't want to print these values as they are in the same place as another label.
        if (key!="L1" && key!="L2" && key!="L3") {
            this.text({context:context, c:key, v:value, translatePos: translatePos});
        } // if
    } //static vector
}
