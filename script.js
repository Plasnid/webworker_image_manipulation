// * holds onto the context we put our image data into
let tempContext;

// *this function gets run when we get back processed data from the worker
function changeImage(e){
    tempContext.putImageData(new ImageData(e.data,960), 0, 0);
}

function process() {
    // * identify the source and the canvas
    let source = document.getElementById("source");
    let canvas = document.getElementById("target");

    // *select the width and height of the canvas...we shrink this a bit in css
    // *if the canvas width and height doesn't match the image width and height initially this breaks
    canvas.width = source.clientWidth;
    canvas.height = source.clientHeight;

    // *setting the context of the canvas to 2d
    tempContext = canvas.getContext("2d");
    // *len is the number of items in the binaryData array
    // *it is 4 times the number of pixels in the canvas object
    let len = canvas.width * canvas.height * 4;
    // *here we draw the initial image to the canvas 
    tempContext.drawImage(source, 0, 0, canvas.width, canvas.height);

    // *get the data from the canvas at that moment
    let canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);
    // *the canvas data is held in a big array  called data
    let binaryData = canvasData.data;

    // *we define a new worker and tell it what script to run
    // *surprise!  server side node likes var
    let w = new Worker('sepiaWorker.js');
    // *when we get a message back from our script, we run changeImage
    w.onmessage = changeImage;
    // *we send our worker the data we would like it to process
    w.postMessage({binDat:binaryData, howLong:len});
};
process();