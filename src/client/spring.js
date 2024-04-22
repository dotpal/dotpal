const Spring = {}
{
	const cos = Math.cos
	const sin = Math.sin
	const exp = Math.exp
	const sqrt = Math.sqrt
	Spring.create = () => {
		const spring = {}
		let t = get_time()
		let p = Math.random()
		let v = 0
		let b = 0
		let k = 10
		let d = 0.7
		const poop = () => {
			const t1 = get_time()
			const [p1, v1] = spring.evaluate(t1 - t)
			p = p1
			v = v1
			t = t1
		}
		spring.get_position = () => {
			poop()
			return p
		}
		spring.set_target = (b1) => {
			poop()
			b = b1
		}
		spring.step = (dt) => {
			poop()
		}
		spring.evaluate = (t) => {
			const h = sqrt(1 - d*d)
			const x = t*h*k // not really correct but whatever
			const s = sin(x)
			const c = h*cos(x) // not really c, more like hc
			const y = h*exp(d*x/h) // more like hy i guess
			// assuming k > 0 && d < 1
			return [b + (k*(p - b)*(c + d*s) + v*s)/(k*y), (k*(b - p)*s + v*(c - d*s))/y]
		}
		return spring
	}
}