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
const gapSize = 30;


// length noise => length map for rectangles
const lengthNoise = new PerlinNoise();
var lengthNoiseOffset = {
	x: 0,
	y: 0
}
var lengthOffsetVector = {
	x: lengthNoise.get(Math.random(), Math.random()),
	y: lengthNoise.get(Math.random(), Math.random())
}

// rotation noise => rotation map for rectangles
const rotationNoise = new PerlinNoise();
var rotationNoiseOffset = {
	x: 0,
	y: 0
}
var rotationOffsetVector = {
	x: lengthNoise.get(Math.random(), Math.random()),
	y: lengthNoise.get(Math.random(), Math.random())
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
			const xMapPos = (x + lengthNoiseOffset.x) / zoomScale;
			const yMapPos = (y + lengthNoiseOffset.y) / zoomScale;
			const height = maxLength * clamp((lengthNoise.get(xMapPos, yMapPos)), 0, maxLength);
			roundRect(ctx, x * (width + gapSize), y * (width + gapSize), width, height, width / 2, 
						true, '#32323288', 
						true, '#22aaff', 1);
		}
	}

	lengthNoiseOffset = moveNoise(lengthNoiseOffset, lengthOffsetVector);
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
function roundRect(ctx, x, y, width, height, radius = 0, 
					fill = true, fillColor = '#dededf', 
					stroke = true, strokeColor = '#ffffff', strokeWidth = 2) {
	if (height < radius * 2 || width < radius * 2) {return; }
	ctx.beginPath();
	ctx.strokeStyle = strokeColor;
	ctx.lineWidth = strokeWidth;
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	if (fill) { 
		ctx.fillStyle = fillColor;
		ctx.fill(); 
	}
	if (stroke) { ctx.stroke(); }
}
