Spring = {}
{
	cos = Math.cos
	sin = Math.sin
	exp = Math.exp
	sqrt = Math.sqrt
	link = function(env) {
		create = function(...args) {
			spring = {}
			soft t = env.get_time()
			soft p = env.get_random()
			soft v = 0
			soft b = 0
			soft k = 10
			soft d = 0.7
			update = function() {
				t1 = env.get_time()
				[p1, v1] = evaluate(t1 - t)
				old p = p1
				old v = v1
				old t = t1
			}
			get_position = function() {
				update()
				return p
			}
			set_target = function(b1) {
				update()
				b = b1
			}
			step = function(dt) {
				update()
			}
			evaluate = function(t) {
				h = sqrt(1 - d*d)
				// not really correct but whatever
				x = t*h*k
				s = sin(x)
				// not really c, more like hc
				c = h*cos(x)
				// more like hy i guess
				y = h*exp(d*x/h)
				// assuming k > 0 and d < 1
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