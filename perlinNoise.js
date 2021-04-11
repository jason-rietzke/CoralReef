'use strict';

class PerlinNoise {

	/** Initialise this PerlinNoise with an optional zoom-factor and optional offset-point
	 * @param {Number} zoomScale 
	 * @param {{x: Number, y: Number}} offset 
	 */
	constructor(zoomScale = 1, offset = {x: 0, y: 0}) {
		this.gradients = {};
		this.zoomScale = zoomScale;
		this.offset = offset;
	}

	randomVector() {
		let theta = Math.random() * 2 * Math.PI;
		return {
			x: Math.cos(theta), 
			y: Math.sin(theta)
		};
	}

	smootherstep(x) {
		return 6*x**5 - 15*x**4 + 10*x**3;
	}

	dotProdGrid(x, y, vx, vy) {
		let g_vect;
		let d_vect = {x: x - vx, y: y - vy};
		if (this.gradients[[vx,vy]]){
			g_vect = this.gradients[[vx,vy]];
		} else {
			g_vect = this.randomVector();
			this.gradients[[vx, vy]] = g_vect;
		}
		return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
	}

	interpolate(x, a, b) {
		return a + this.smootherstep(x) * (b - a);
	}

	/** generate a new seed
	 */
	seed() {
		this.gradients = {};
	}

	/** returnes the noise value at this specific location
	 * @param {Number} x 
	 * @param {Number} y 
	 * @returns interpolated value
	 */
	getAt(x, y) {
		let xf = Math.floor(x);
		let yf = Math.floor(y);
		//interpolate
		let tl = this.dotProdGrid(x, y, xf,   yf);
		let tr = this.dotProdGrid(x, y, xf+1, yf);
		let bl = this.dotProdGrid(x, y, xf,   yf+1);
		let br = this.dotProdGrid(x, y, xf+1, yf+1);
		let xt = this.interpolate(x-xf, tl, tr);
		let xb = this.interpolate(x-xf, bl, br);
		let v = this.interpolate(y-yf, xt, xb);
		return v;
	}

	/** returnes the noise value at this location + the offset vector
	 * @param {Number} x 
	 * @param {Number} y 
	 * @returns interpolated value
	 */
	get(x, y) {
		return this.getAt((x + this.offset.x) / this.zoomScale, 
						  (y + this.offset.y) / this.zoomScale);
	}

	/** moves the noise layer according to a vector
	 * @param {{x: Number, y: Number}} vector
	 */
	move(vector) {
		this.offset.x += vector.x;
		this.offset.y += vector.y;
	}

	/** moves the noise layer to a specific position
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	moveTo(x, y) {
		this.offset.x = x;
		this.offset.y = y;
	}

}
