const Spring = {}
{
	const cos = Math.cos
	const sin = Math.sin
	const exp = Math.exp
	const sqrt = Math.sqrt
	Spring.link = (env) => {
		Spring.create = (...args) => {
			const spring = {}
			let t = env.get_time()
			let p = env.get_random()
			let v = 0
			let b = 0
			let k = 10
			let d = 0.7
			const update = () => {
				const t1 = env.get_time()
				const [p1, v1] = spring.evaluate(t1 - t)
				p = p1
				v = v1
				t = t1
			}
			spring.get_position = () => {
				update()
				return p
			}
			spring.set_target = (b1) => {
				update()
				b = b1
			}
			spring.step = (dt) => {
				update()
			}
			spring.evaluate = (t) => {
				const h = sqrt(1 - d*d)
				// not really correct but whatever
				const x = t*h*k
				const s = sin(x)
				// not really c, more like hc
				const c = h*cos(x)
				// more like hy i guess
				const y = h*exp(d*x/h)
				// assuming k > 0 && d < 1
				return [b + (k*(p - b)*(c + d*s) + v*s)/(k*y), (k*(b - p)*s + v*(c - d*s))/y]
			}
			return spring
		}
	}
}