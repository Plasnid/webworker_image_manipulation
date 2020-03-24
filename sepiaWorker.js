function noise() {
    // * Returns a value between 0.5 and 1
    return Math.random() * 0.5 + 0.5;
};

function colorDistance(scale, dest, src) {
    // * returns a red, blue or green value for the 'sepia' pixel
    // * which is a weighted average of the original value and the calculated value
    return (scale * dest + (1 - scale) * src);
};

// *process sepia workes with colour distance and noise to make our image sepia
// *so much var, but let will break our worker!
var processSepia = function (binaryData, l) {
    for (var i = 0; i < l; i += 4) {
        var r = binaryData[i];
        var g = binaryData[i + 1];
        var b = binaryData[i + 2];

        binaryData[i] = colorDistance(noise(), (r * 0.393) + (g * 0.769) + (b * 0.189), r);
        binaryData[i + 1] = colorDistance(noise(), (r * 0.349) + (g * 0.686) + (b * 0.168), g);
        binaryData[i + 2] = colorDistance(noise(), (r * 0.272) + (g * 0.534) + (b * 0.131), b);
    }
    // *finally we post back the data to the script the called the worker
    postMessage(binaryData);
};

// *when we get a message, we send the data and the length to processSepia
self.onmessage = function(msg){
    this.processSepia(msg.data.binDat, msg.data.howLong);
}