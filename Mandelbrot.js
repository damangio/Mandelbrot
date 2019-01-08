var CENTER_RE = -0.5;
var CENTER_IM = 0;
var RANGE_RE = 3;
var MAX_ITER = 30;
var INFLECTION = 15;
//~ var CENTER_RE = -0.105;
//~ var CENTER_IM = -0.925;
//~ var RANGE_RE = 0.02;
//~ var MAX_ITER = 80;
//~ var INFLECTION = 40;

var args = location.search.split(/[&?]/);
console.log(args);
for (var i = 0; i < args.length; i += 1) {
    if (/re=.*/.exec(args[i])) {
        try {
            CENTER_RE = parseFloat(/re=(.*)/.exec(args[i])[1]);
        } catch (e) {}
    }
    if (/im=.*/.exec(args[i])) {
        try {
            CENTER_IM = parseFloat(/im=(.*)/.exec(args[i])[1]);
        } catch (e) {}
    }
    if (/width.*/.exec(args[i])) {
        try {
            RANGE_RE = parseFloat(/width=(.*)/.exec(args[i])[1]);
        } catch (e) {}
    }
    if (/iter=.*/.exec(args[i])) {
        try {
            MAX_ITER = parseFloat(/iter=(.*)/.exec(args[i])[1]);
        } catch (e) {}
    }
    if (/inflection=.*/.exec(args[i])) {
        try {
            INFLECTION = parseFloat(/inflection=(.*)/.exec(args[i])[1]);
        } catch (e) {}
    }
}

var RANGE_IM = RANGE_RE * 5 / 6;
var MIN_RE = CENTER_RE - RANGE_RE / 2;
var MAX_RE = CENTER_RE + RANGE_RE / 2;
var MIN_IM = CENTER_IM - RANGE_IM / 2;
var MAX_IM = CENTER_IM + RANGE_IM / 2;
var PRE_INFLECTION = INFLECTION / MAX_ITER;
var POST_INFLECTION = 1 - PRE_INFLECTION;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var imageData = ctx.createImageData(canvas.width, canvas.height);

for (var x = 0; x < imageData.width; x += 1) {
    var re = MIN_RE + (RANGE_RE) * ((x + 1) / imageData.width);
    for (var y = 0; y < imageData.height; y += 1) {
        var im = MAX_IM - (RANGE_IM) * ((y + 1) / imageData.height);
        var c = math.complex(re, im);
        var z = math.complex(0, 0);
        var n = 0
        mandelbrot = true;
        for (; n < MAX_ITER; n += 1) {
            z = math.add(math.multiply(z, z), c);
            if (math.abs(z) >= 2) {
                mandelbrot = false;
                break;
            }
        }
        if (mandelbrot) {
            colorPixel(x, y, {red: 0, green: 0, blue: 0}); // black
        } else {
            colorPixel(x, y, genColor(n / MAX_ITER));
        }
    }
}

ctx.putImageData(imageData, 0, 0);

function colorPixel(x, y, color) {
    var offset = y * canvas.width * 4 + x * 4;
    imageData.data[offset] = color.red;
    imageData.data[offset + 1] = color.green;
    imageData.data[offset + 2] = color.blue
    imageData.data[offset + 3] = 255; // alpha
}

function genBlue(scale) {
    // 0 is white; 1 is blue
    return {
        red: 255 * scale,
        green: 255 * scale,
        blue: 127 + (255 - 127) * scale
    }
}

function genRed(scale) {
    // 0 is white; 0.5 is red; 1 is black
    if (scale < 0.5) {
        var adjScale = 2 * scale;
        return {
            red: 255,
            green: 255 - (255 - 90) * adjScale,
            blue: 255 - 255 * adjScale
        }
    } else {
        var adjScale = 2 * (scale - 0.5);
        return {
            red: 255 - 255 * adjScale,
            green: 90 - 90 * adjScale,
            blue: 0
        }
    }
}

function genColor(scale) {
    // 0 is far from Mandelbrot; 1 is Mandelbrot
    if (scale < PRE_INFLECTION) {
        return genBlue(scale / PRE_INFLECTION);
    } else {
        return genRed(1 - (1 - scale) / POST_INFLECTION);
    }
}
