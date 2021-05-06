'use strict';

var DRAW_COUNTER = 0;
var STROKE_COUNTER = 0;
var FRAME_TIME = 0;
var CALC_TIME = 0;
var RENDER_TIME = 0;
var MOVE_TIME = 0;

init();
window.onresize = resizeCanvas;

function init() {
	resizeCanvas();
	const canvas = document.getElementById('canvas');
	canvas.addEventListener('resize', () => {
		resizeCanvas();
	})
	window.requestAnimationFrame(draw);

	const measurementTime = 5 * 1000;
	setInterval(() => {
		console.clear();
		setTimeout(() => {
			console.group('STATS');
			console.log(DRAW_COUNTER + ' draws in ' + measurementTime / 1000 +' sec with ' + STROKE_COUNTER + ' rendered strokes');
			console.log('avg. calc-time: \t\t' + ((CALC_TIME / FRAME_TIME) * 100).toFixed(4) + '%');
			console.log('avg. render-time: \t' + ((RENDER_TIME / FRAME_TIME) * 100).toFixed(4) + '%');
			console.log('avg. move-time: \t' + ((MOVE_TIME / FRAME_TIME) * 100).toFixed(4) + '%');
			console.groupEnd();
	
			DRAW_COUNTER = 0;
			STROKE_COUNTER = 0;
			FRAME_TIME = 0;
			CALC_TIME = 0;
			RENDER_TIME = 0;
			MOVE_TIME = 0;
		}, 10);
	}, measurementTime);
}

// set the canvas sizes or match screenSize if value < 0
function resizeCanvas() {
	const canvas = document.getElementById('canvas');
	canvas.setAttribute('height', canvas.clientHeight);
	canvas.setAttribute('width', canvas.clientWidth);
	canvas.style.backgroundColor = '#000000';
}


function clamp(number, min, max) {
	return Math.max(min, Math.min(number, max));
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomVector() {
	const x = getRandomInt(2, 5) / 100;
	const y = getRandomInt(2, 5) / 100;
	return {
		x: (Math.random() > 0.5 ? -1 : 1) * x * (document.body.clientHeight / 1000),
		y: (Math.random() > 0.5 ? -1 : 1) * y * (document.body.clientHeight / 1000)
	}
}


// constances for map generation
const zoomScale = (document.body.clientHeight / 100);
const fieldSize = (document.body.clientHeight / 20);
const pointMaxLength = (document.body.clientHeight / 2);
const recursivePoints = 1;


// length noise => length map for rectangles
const lengthNoise = new PerlinNoise(zoomScale);
var lengthOffsetVector = randomVector();

// rotation noise => rotation map for rectangles
const rotationNoise = new PerlinNoise(zoomScale * 2);
var rotationOffsetVector = randomVector();

// red color noise => color map for red fill of rectangles
const rColorNoise = new PerlinNoise(zoomScale);
var rColorOffsetVector = randomVector();

// green color noise => color map for green fill of rectangles
const gColorNoise = new PerlinNoise(zoomScale);
var gColorOffsetVector = randomVector();

// blue color noise => color map for blue fill of rectangles
const bColorNoise = new PerlinNoise(zoomScale);
var bColorOffsetVector = randomVector();


// draw canvas content
function draw() {
	const frameTime = Date.now();
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// clear canvas
	ctx.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'));

	// loop through the positions in the 2D canvas
	let strokeCounter = 0;
	for (var x = 0; x < canvas.clientWidth / fieldSize / recursivePoints; x++) {
		for (var y = 0; y < canvas.clientHeight / fieldSize / recursivePoints; y++) {

			const calcTime = Date.now();
			const height = pointMaxLength * clamp(lengthNoise.get(x, y), 0, 1);
			const rotation = rotationNoise.get(x, y) * (360 * 3 / Math.PI);
			const rColor = clamp((256 * 3 * rColorNoise.get(x, y)), 64, 512);
			const gColor = clamp((256 * 3 * gColorNoise.get(x, y)), 64, 512);
			const bColor = clamp((256 * 3 * bColorNoise.get(x, y)), 64, 512);
			CALC_TIME += Date.now() - calcTime;

			const renderTime = Date.now();
			for (var ix = 0; ix < recursivePoints; ix++) {
				for (var iy = 0; iy < recursivePoints; iy++) {
					strokeCounter += 1;
					roundRect(ctx, ((x * recursivePoints) * fieldSize) + (ix * fieldSize), ((y * recursivePoints) * fieldSize) + (iy * fieldSize), (fieldSize / 2), height, fieldSize / (2 * 2), rotation,
							true, `rgba(${rColor}, ${gColor} ,${bColor})`, 
							false, '#22aaff', 1);
				}
			}
			RENDER_TIME += Date.now() - renderTime;
		}
	}
	STROKE_COUNTER = strokeCounter;

	const moveTime = Date.now();
	lengthNoise.move(lengthOffsetVector);
	rotationNoise.move(rotationOffsetVector);

	rColorNoise.move(rColorOffsetVector);
	gColorNoise.move(gColorOffsetVector);
	bColorNoise.move(bColorOffsetVector);
	MOVE_TIME += Date.now() - moveTime;

	FRAME_TIME += Date.now() - frameTime;
	DRAW_COUNTER ++;

	window.requestAnimationFrame(draw);
}



/** draws a rounded rectangle into the canvas-context
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} radius 
 * @param {Boolean} fill 
 * @param {String} fillColor 
 * @param {Boolean} stroke 
 * @param {String} strokeColor 
 * @param {Number} strokeWidth 
 */
function roundRect(ctx, x, y, width, height, radius = 0, rotation = 0,
					fill = true, fillColor = '#dededf', 
					stroke = true, strokeColor = '#ffffff', strokeWidth = 2) {
	if (height < radius * 2 || width < radius * 2) { return; }
	ctx.save();
	ctx.beginPath();
	ctx.translate(x + width/2, y + height/2);
	ctx.rotate(rotation * Math.PI / 180);
	ctx.strokeStyle = strokeColor;
	ctx.lineWidth = strokeWidth;
	ctx.moveTo(radius, 0);
	ctx.lineTo(width - radius, 0);
	ctx.quadraticCurveTo(width, 0, width, radius);
	ctx.lineTo(width, height - radius);
	ctx.quadraticCurveTo(width, height, width - radius, height);
	ctx.lineTo(radius, height);
	ctx.quadraticCurveTo(0, height, 0, height - radius);
	ctx.lineTo(0, radius);
	ctx.quadraticCurveTo(0, 0, radius, 0);
	ctx.closePath();
	if (fill) { 
		// gradient
		var g = ctx.createLinearGradient(0, 0, 1, height);
		g.addColorStop(0, '#00000000');
		g.addColorStop(1, fillColor);
		ctx.fillStyle = g;
		ctx.fill();
	}
	if (stroke) { ctx.stroke(); }
	ctx.restore();
}
