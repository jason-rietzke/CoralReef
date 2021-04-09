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


function draw() {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	const width = 10;

	// ctx.globalCompositeOperation = 'destination-over';
	ctx.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height')); // clear canvas

	// loop through the positions in the 2D canvas
	for (var x = 0; x < canvas.clientWidth / (width*1.5); x++) {
		for (var y = 0; y < canvas.clientHeight / (width*1.5); y++) {
			roundRect(ctx, x * (width * 1.5), y * (width * 1.5), width, width * 4, width / 2, true, '#323232', true, '#22aaff', 2);
		}	
	}
	// console.log((x * y) + ' strokes');
	window.requestAnimationFrame(draw);
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
	ctx.beginPath();
	ctx.strokeStyle = strokeColor;
	ctx.lineWidth = strokeWidth;
	ctx.fillStyle = fillColor;
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
	if (fill) { ctx.fill(); }
	if (stroke) { ctx.stroke(); }
}