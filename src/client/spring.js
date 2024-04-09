const Spring = {}
{
	const cos = Math.cos
	const sin = Math.sin
	const exp = Math.exp
	const sqrt = Math.sqrt
	Spring.create = function(p, v, k, d) {
		const self = {}
		const t = 0
		self.step = function(dt) {
			t += dt
		}
		self.update = function(t1) {
			t = t1
		}
		self.evaluate = function() {
			const h = sqrt(1 - d*d)
			const t = t*h*k // not really correct but whatever
			const s = sin(t)
			const c = h*cos(t) // not really c, more like hc
			const y = h*exp(d*t/h) // more like hy i guess
			// assuming k > 0 && d < 1
			return [b + (k*(p - b)*(c + d*s) + v*s)/(k*y), (k*(b - p)*s + v*(c - d*s))/y]
		}
		return self
	}
}