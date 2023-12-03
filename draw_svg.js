/**
JS Draw Vectors

Contains a set of functiions useful for drawing to the canvas object.
 
Crated by Neil Bezuidenhout
20 November 2023
*/

const removeChilds = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

class DrawSVG {
    // Static property to invert the y-axis as 0,0 is top left by default
    static invert_y = true;
    // Destination DOM to where the elemetns should be appended
    static context;

    // Private method to create a line element: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line
    static #line({context, c, x1, y1, x2, y2, stroke="black", text}) {
        var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        // set the id of the line
        newLine.setAttribute('id',text);
        newLine.setAttribute('class',c);
        newLine.setAttribute('x1',x1);
        newLine.setAttribute('y1',y1);
        newLine.setAttribute('x2',x2);
        newLine.setAttribute('y2',y2);
        newLine.setAttribute("stroke", stroke)
        // add the line to the context
        $(context).append(newLine);
    }

    // Private method to create text element: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text
    static #text({context, c, x, y, dx, dy, stroke="black", text}) {
        var newText = document.createElementNS('http://www.w3.org/2000/svg','text');
        newText.setAttribute('class',c);
        newText.setAttribute('x',x);
        newText.setAttribute('y',y);
        // newText.setAttribute('dx','-0.5%');
        // newText.setAttribute('dy','-0.5%');
        var textNode = document.createTextNode(text);
        newText.appendChild(textNode);
        newText.setAttribute("stroke", stroke)
        $(context).append(newText);
    }

    // Draw a line on the canvas in x,y start to x,y end coordinates
    static line({context, c, v, translatePos}) {

        // Need to perform some translations first before passing coordinates to the setAttribute function
        let x1 = translatePos.x + v.start.x;
        let y1 = translatePos.y + v.start.y;
        let x2 = translatePos.x + v.end.x;
        let y2 = translatePos.y + v.end.y;
        if (this.invert_y === true) {
            y1 = translatePos.y - v.start.y;
            y2 = translatePos.y - v.end.y;
        }

        this.#line({context: context, c:c, x1:x1.toFixed(0), y1:y1.toFixed(0), x2:x2.toFixed(0), y2:y2.toFixed(0), text:v.label});
    }


    // Draw a line on the canvas in x,y start to x,y end coordinates
    static text({context, c, v, translatePos}) {

        // Need to perform some translations first before passing coordinates to the setAttribute function
        let x = translatePos.x + v.end.x;
        let y = translatePos.y + v.end.y;

        if (this.invert_y === true) {
            y = translatePos.y - v.end.y;
        }

        this.#text({context: context, c:c, x:x.toFixed(0), y:y.toFixed(0), text:v.label});
    }

    static #axis({context, translatePos}) {
        // Remember that translatePos will give the centre of the graph, therefore it is o'
        this.#line({context: context, c:"axis", x1: -translatePos.x, y1: translatePos.y, x2: translatePos.x*2, y2: translatePos.y, stroke: "gray", text:"x-axis"});
        this.#line({context: context, c:"axis", x1: translatePos.x, y1: -translatePos.y, x2: translatePos.x , y2: translatePos.y*2, stroke: "gray", text:"x-axis"});
    
    }

    // Shorthand call to both functions
    static vector({context, key, value, translatePos}) {
        this.#axis({context:context, translatePos: translatePos});
        this.line({context:context, c:key, v:value, translatePos: translatePos});
        // Don't want to print these values as they are in the same place as another label.
        if (key!="L1" && key!="L2" && key!="L3") {
            this.text({context:context, c:key, v:value, translatePos: translatePos});
        }
    }
}

function plot_svg({context, scale, translatePos}) {

    // remove all child nodes
    removeChilds(context);

    for (let [key, value] of Object.entries(vectors)) {
        DrawSVG.vector({context:context, key:key, value:value, translatePos: translatePos});
    }
}