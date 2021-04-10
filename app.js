'use strict';

window.onload = init;
window.onresize = resizeCanvas;

function init() {
	resizeCanvas();
	window.requestAnimationFrame(draw);
}

// set the canvas sizes or match screenSize if value < 0
function resizeCanvas(height = -1, width = -1) {
	const canvas = document.getElementById('canvas');
	canvas.setAttribute('height', height < 0 ? document.body.clientHeight : height);
	canvas.setAttribute('width', width < 0 ? document.body.clientWidth : width);
	canvas.style.backgroundColor = '#000000';
}


// moves a noise layer to create a random but smooth movement
function moveNoise(offset, vector) {
	offset.x = offset.x + vector.x;
	offset.y = offset.y + vector.y;
	return offset;
}

function clamp(number, min, max) {
	return Math.max(min, Math.min(number, max));
}


// constances for map generation
const zoomScale = 10;
const maxLength = 200;
const width = 15;
const gapSize = 20;


// length noise => length map for rectangles
const lengthNoise = new PerlinNoise();
var lengthNoiseOffset = {
	x: 0,
	y: 0
}
var lengthOffsetVector = {
	x: lengthNoise.get(Math.random(), Math.random()) / 4,
	y: lengthNoise.get(Math.random(), Math.random()) / 4
}

// rotation noise => rotation map for rectangles
const rotationNoise = new PerlinNoise();
var rotationNoiseOffset = {
	x: 0,
	y: 0
}
var rotationOffsetVector = {
	x: rotationNoise.get(Math.random(), Math.random()) / 2,
	y: rotationNoise.get(Math.random(), Math.random()) / 2
}

// red color noise => color map for red fill of rectangles
const rColorNoise = new PerlinNoise();
var rColorNoiseOffset = {
	x: 0,
	y: 0
}
var rColorOffsetVector = {
	x: rColorNoise.get(Math.random(), Math.random()) / 4,
	y: rColorNoise.get(Math.random(), Math.random()) / 4
}

// green color noise => color map for green fill of rectangles
const gColorNoise = new PerlinNoise();
var gColorNoiseOffset = {
	x: 0,
	y: 0
}
var gColorOffsetVector = {
	x: gColorNoise.get(Math.random(), Math.random()) / 4,
	y: gColorNoise.get(Math.random(), Math.random()) / 4
}

// blue color noise => color map for blue fill of rectangles
const bColorNoise = new PerlinNoise();
var bColorNoiseOffset = {
	x: 0,
	y: 0
}
var bColorOffsetVector = {
	x: bColorNoise.get(Math.random(), Math.random()) / 4,
	y: bColorNoise.get(Math.random(), Math.random()) / 4
}


// draw canvas content
function draw() {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// clear canvas
	ctx.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'));

	// loop through the positions in the 2D canvas
	for (var x = 0; x < canvas.clientWidth / (width + gapSize); x++) {
		for (var y = 0; y < canvas.clientHeight / (width + gapSize); y++) {
			// length values
			const xLenMapPos = (x + lengthNoiseOffset.x) / zoomScale;
			const yLenMapPos = (y + lengthNoiseOffset.y) / zoomScale;
			const height = maxLength * clamp((lengthNoise.get(xLenMapPos, yLenMapPos)), 0, maxLength);

			// rotation values
			const xRotMapPos = (x + rotationNoiseOffset.x) / zoomScale;
			const yRotMapPos = (y + rotationNoiseOffset.y) / zoomScale;
			const rotation = rotationNoise.get(xRotMapPos, yRotMapPos) * (720 / Math.PI);

			// rColor values
			const xRColMapPos = (x + rColorNoiseOffset.x) / (zoomScale / 2);
			const yRColMapPos = (y + rColorNoiseOffset.y) / (zoomScale / 2);
			const rColor = clamp((256 * rColorNoise.get(xRColMapPos, yRColMapPos)), 0, 256);
			// gColor values
			const xGColMapPos = (x + gColorNoiseOffset.x) / (zoomScale / 2);
			const yGColMapPos = (y + gColorNoiseOffset.y) / (zoomScale / 2);
			const gColor = clamp((256 * gColorNoise.get(xGColMapPos, yGColMapPos)), 0, 256);
			// bColor values
			const xBColMapPos = (x + bColorNoiseOffset.x) / (zoomScale / 2);
			const yBColMapPos = (y + bColorNoiseOffset.y) / (zoomScale / 2);
			const bColor = clamp((256 * bColorNoise.get(xBColMapPos, yBColMapPos)), 0, 256);

			roundRect(ctx, x * (width + gapSize), y * (width + gapSize), width, height, width / 2, rotation,
						true, `rgba(${rColor}, ${gColor} ,${bColor} , 0.5)`, 
						false, '#22aaff', 1);
		}
	}

	lengthNoiseOffset = moveNoise(lengthNoiseOffset, lengthOffsetVector);
	rotationNoiseOffset = moveNoise(rotationNoiseOffset, rotationOffsetVector);

	rColorNoiseOffset = moveNoise(rColorNoiseOffset, rColorOffsetVector);
	gColorNoiseOffset = moveNoise(gColorNoiseOffset, gColorOffsetVector);
	bColorNoiseOffset = moveNoise(bColorNoiseOffset, bColorOffsetVector);

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
	if (height < radius * 2 || width < radius * 2) {return; }
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
		ctx.fillStyle = fillColor;
		ctx.fill(); 
	}
	if (stroke) { ctx.stroke(); }
	ctx.restore();
}
