const Spring = {}
{
	const cos = Math.cos
	const sin = Math.sin
	const exp = Math.exp
	const sqrt = Math.sqrt
	const link = (env) => {
		const create = (...args) => {
			const spring = {}
			let t = env.get_time()
			let p = env.get_random()
			let v = 0
			let b = 0
			let k = 10
			let d = 0.7
			const update = () => {
				const t1 = env.get_time()
				const [p1, v1] = evaluate(t1 - t)
				p = p1
				v = v1
				t = t1
			}
			const get_position = () => {
				update()
				return p
			}
			const set_target = (b1) => {
				update()
				b = b1
			}
			const step = (dt) => {
				update()
			}
			const evaluate = (t) => {
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
			spring.get_position = get_position
			spring.set_target = set_target
			spring.step = step
			spring.update = update
			return spring
		}
		Spring.create = create
	}
	Spring.link = link
}