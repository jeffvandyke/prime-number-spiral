import { makeSpiralIncrementor } from "./makeSpiralIncrementor";
// import sieves from 'prime-sieves';

function initCanvas() {
    const canvas = document.getElementById("draw-area") as HTMLCanvasElement;
    if (!canvas) throw new Error("Canvas element not found");
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Could not get canvas 2d context");
    (window as any).ctx = ctx;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Scale canvas (based on https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

    // Get the DPR and size of the canvas
    var dpr = window.devicePixelRatio;
    var rect = canvas.getBoundingClientRect();

    // Set the "actual" size of the canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    ctx.scale(dpr, dpr);

    // Set the "drawn" size of the canvas
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    // Test drawing
    ctx.fillStyle = "green";
    ctx.fillRect(100, 100, 100, 100);
    return { canvas, ctx };
}

const { canvas, ctx } = initCanvas();
const boundingRect = canvas.getBoundingClientRect();

// ---- Draw parameters ----

const canvasOriginPoint = {
    x: Math.floor(boundingRect.width / 2),
    y: Math.floor(boundingRect.height / 2),
};
const pointScale = 1;

// ---- Init draw ----
ctx.fillStyle = "white";
ctx.fillRect(0, 0, boundingRect.width, boundingRect.height);

const drawGrid = false;
if (drawGrid) {
    ctx.strokeStyle = "gray";
    ctx.moveTo(0 + 0.5, canvasOriginPoint.y + 0.5);
    ctx.lineTo(boundingRect.width + 0.5, canvasOriginPoint.y + 0.5);
    ctx.moveTo(canvasOriginPoint.x + 0.5, 0 + 0.5);
    ctx.lineTo(canvasOriginPoint.x + 0.5, boundingRect.height + 0.5);
    ctx.stroke();
}

// ---- Setup draw function ----

function drawPointFromOrigin(x: number, y: number) {
    const [drawX, drawY] = [
        x * pointScale + canvasOriginPoint.x,
        y * -1 * pointScale + canvasOriginPoint.y,
    ];

    ctx.fillStyle = "black"; // x % 3 === 0 ? "red" : x % 3 === 1 ? "green" : "blue";
    // x3: ctx.fillRect(drawX - 1, drawY - 1, 3, 3);
    ctx.fillRect(drawX, drawY, pointScale, pointScale);
}

const { stepNext } = makeSpiralIncrementor();

// ---- Prime indicator ----

const knownPrimes = [2];
function isPrime(n: number) {
    if (n === 1) return false;
    if (n === 2) return true;
    // const stopPoint = Math.ceil(Math.sqrt(n));
    for (let i = 0; i < knownPrimes.length; i++) {
        const knownPrime = knownPrimes[i]
        if (n % knownPrime === 0) {
            return false;
        }
        // if (knownPrime > stopPoint) return false;
    }
    knownPrimes.push(n);
    return true;
}

// ---- Main loop ----

const maxDimension =
    Math.max(boundingRect.height, boundingRect.width) / pointScale;
// 1, 4, 9, 16, 25
// 1, 2, 3, 4, 5
const maxNumberToDraw = maxDimension ** 2;


console.log('generating primes...');

// const primes = sieves.atkin(maxNumberToDraw);

console.log(`drawing begin, ${maxNumberToDraw} points`);
let n = 1;

function step() {
    if (n < maxNumberToDraw) {
        for (var i = 0; i < 10000; i++) {
            const nIsPrime = isPrime(n);
            // const nIsPrime = primes[n];

            // console.log(`${n} is ${nIsPrime ? 'prime' : 'not prime'}`);
            stepNext(nIsPrime ? drawPointFromOrigin : () => {});
            n += 1;
        }

        window.requestAnimationFrame(step);
    } else {
        // Final block
        console.log({ knownPrimes });

        console.log("done drawing");
    }
}

window.requestAnimationFrame(step);
