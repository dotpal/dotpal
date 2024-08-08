// thanks to trey
Poly = {}
{
	sqrt = Math.sqrt
	cbrt = Math.cbrt
	epsilon = 1e-10
	// solve results are guaranteed real and sorted.
	link = function(env) {
		Logic = env.require("Logic")
		or = Logic.or
		is = Logic.is
		solve = function(a, b, c, d, e) {
			if is(a) and -epsilon < a and a < epsilon {
				return solve(b, c, d, e)
			}
			else if is(e) {
				k = -b/(4*a)
				p = (8*a*c - 3*b*b)/(8*a*a)
				q = (b*b*b + 8*a*a*d - 4*a*b*c)/(8*a*a*a)
				r = (16*a*a*b*b*c + 256*a*a*a*a*e - 3*a*b*b*b*b - 64*a*a*a*b*d)/(256*a*a*a*a*a)
				[h0, h1, h2] = solve(1, 2*p, p*p - 4*r, -q*q)
				s = or(h2, h0)
				if s < epsilon {
					[f0, f1] = solve(1, p, r)
					// idk if this or should be here
					if not is(f1) or f1 < 0 {
						return []
					}
					else {
						[f] = sqrt(f1)
						return [k - f, k + f]
					}
				}
				else {
					h = sqrt(s)
					f = (h*h*h + h*p - q)/(2*h)
					if -epsilon < f and f < epsilon {
						return [k - h, k]
					}
					else {
						[r0, r1] = solve(1, h, f)
						[r2, r3] = solve(1, -h, r/f)
						if is(r0) and is(r2) {
							return [k + r0, k + r1, k + r2, k + r3]
						}
						else if is(r0) {
							return [k + r0, k + r1]
						}
						else if is(r2) {
							return [k + r2, k + r3]
						}
						else {
							return []
						}
					}
				}
			}
			else if is(d) {
				k = -b/(3*a)
				p = (3*a*c - b*b)/(9*a*a)
				q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(54*a*a*a)
				r = p*p*p + q*q
				s = sqrt(r) + q
				if -epsilon < s and s < epsilon {
					//p = 0
					if q < 0 {
						return [k + cbrt(-2*q)]
					}
					else {
						return [k - cbrt(2*q)]
					}
				}
				else {
					if r < 0 {
						m = sqrt(-p)
						d = atan2(sqrt(-r), q)/3
						u = m*cos(d)
						v = m*sin(d)
						// sqrt(3)
						return [k - 2*u, k + u - 1.7320508*v, k + u + 1.7320508*v]
					}
					else {
						if s < 0 {
							m = -cbrt(-s)
							return [k + p/m - m]
						}
						else {
							m = cbrt(s)
							return [k + p/m - m]
						}
					}
				}
			}
			else if is(c) {
				k = -b/(2*a)
				u2 = k*k - c/a
				if u2 < 0 {
					return []
				}
				else {
					u = sqrt(u2)
					return [k - u, k + u]
				}
			}
			else if is(b) {
				return [-b/a]
			}
			else {
				return []
			}
		}
		Poly.solve = solve
	}
	Poly.link = link
}