let tempContext;
let start;

function changeImage(e){
    tempContext.putImageData(new ImageData(e.data,960), 0, 0);
    let diff = new Date() - start;
    log.innerText = `Process done in ${diff}ms with web workers`;
}

function process() {
    let source = document.getElementById("source");
    start = new Date();
    let canvas = document.getElementById("target");
    canvas.width = source.clientWidth;
    canvas.height = source.clientHeight;

    tempContext = canvas.getContext("2d");
    // len is the number of items in the binaryData array
    // it is 4 times the number of pixels in the canvas object
    let len = canvas.width * canvas.height * 4;

    tempContext.drawImage(source, 0, 0, canvas.width, canvas.height);

    let canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);
    let binaryData = canvasData.data;

    // processSepia is a variation of the previous version. See below
    //processSepia(binaryData, len);
    let w = new Worker('sepiaWorker.js');
    w.onmessage = changeImage;
    w.postMessage({binDat:binaryData, howLong:len});
};
process();