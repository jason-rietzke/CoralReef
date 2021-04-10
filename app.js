'use strict'

window.onload = init;
window.onresize = resizeCanvas;

function init() {
	resizeCanvas();
	window.requestAnimationFrame(draw);
}

function resizeCanvas() {
	const canvas = document.getElementById('canvas');
	canvas.setAttribute('height', document.body.clientHeight);
	canvas.setAttribute('width', document.body.clientWidth);
	canvas.style.backgroundColor = '#000000';
}

const noiseOffset = {
	x: 0,
	y: 0
}
var offsetVector = {
	x: PerlinNoise.get(Math.random(), Math.random()),
	y: PerlinNoise.get(Math.random(), Math.random())
}

function draw() {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	const width = 10;

	// ctx.globalCompositeOperation = 'destination-over';
	ctx.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height')); // clear canvas

	// loop through the positions in the 2D canvas
	for (var x = 0; x < canvas.clientWidth / (width*1.5); x++) {
		for (var y = 0; y < canvas.clientHeight / (width*1.5); y++) {
			const height = width * clamp((10 * PerlinNoise.get((x + noiseOffset.x) / 50, (y + noiseOffset.y) / 50)), 0, 10);
			roundRect(ctx, x * (width * 1.5), y * (width * 1.5), width, height, width / 2, true, '#323232', true, '#22aaff', 1);
		}
	}

	moveNoise();
	window.requestAnimationFrame(draw);
}


function moveNoise() {
	noiseOffset.x += offsetVector.x;
	noiseOffset.y += offsetVector.y;
	if (noiseOffset.x > 100 || noiseOffset.x < -100) {
		offsetVector.x = - offsetVector.x + (Math.random() / 10);
	}
	if (noiseOffset.y > 100 || noiseOffset.y < -100) {
		offsetVector.y = - offsetVector.y + (Math.random() / 10);
	}
}


// draws a rounded rectangle into the canvas-context
/**
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
function roundRect(ctx, x, y, width, height, radius = 0, fill = true, fillColor = '#dededf', stroke = true, strokeColor = '#ffffff', strokeWidth = 2) {
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

function clamp(number, min, max) {
	return Math.max(min, Math.min(number, max));
}