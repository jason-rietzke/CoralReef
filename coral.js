'use strict';

init();
window.onresize = resizeCanvas;

function init() {
	resizeCanvas();
	const canvas = document.getElementById('canvas');
	canvas.addEventListener('resize', () => {
		resizeCanvas();
	})
	window.requestAnimationFrame(draw);
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
const zoomScale = 20;
const maxLength = 300;
const width = (document.body.clientWidth / 300);
const gapSize = (document.body.clientWidth / 200);


// length noise => length map for rectangles
const lengthNoise = new PerlinNoise(zoomScale);
var lengthOffsetVector = randomVector();

// rotation noise => rotation map for rectangles
const rotationNoise = new PerlinNoise(zoomScale);
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
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// clear canvas
	ctx.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'));

	// loop through the positions in the 2D canvas
	for (var x = 0; x < canvas.clientWidth / (width + gapSize); x++) {
		for (var y = 0; y < canvas.clientHeight / (width + gapSize); y++) {

			const height = maxLength * clamp(lengthNoise.get(x, y), 0, 1);
			const rotation = rotationNoise.get(x, y) * (1440 / Math.PI);
			const rColor = clamp((256 * 3 * rColorNoise.get(x, y)), 64, 512);
			const gColor = clamp((256 * 3 * gColorNoise.get(x, y)), 64, 512);
			const bColor = clamp((256 * 3 * bColorNoise.get(x, y)), 64, 512);

			roundRect(ctx, x * (width + gapSize), y * (width + gapSize), width, height, width / 2, rotation,
						true, `rgba(${rColor}, ${gColor} ,${bColor})`, 
						false, '#22aaff', 1);
		}
	}

	lengthNoise.move(lengthOffsetVector);
	rotationNoise.move(rotationOffsetVector);

	rColorNoise.move(rColorOffsetVector);
	gColorNoise.move(gColorOffsetVector);
	bColorNoise.move(bColorOffsetVector);

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
