// thanks to trey
const Zeros = {}
{
	const sqrt = Math.sqrt
	const cbrt = Math.cbrt
	const epsilon = 1e-10
	// solve results are guaranteed real && sorted.
	Zeros.load = (env) => {
		const or = Logic.or
		const is = Logic.is
		const solve = (a, b, c, d, e) => {
			if (is(a) && -epsilon < a && a < epsilon) {
				return solve(b, c, d, e)
			}
			else if (is(e)) {
				const k = -b/(4*a)
				const p = (8*a*c - 3*b*b)/(8*a*a)
				const q = (b*b*b + 8*a*a*d - 4*a*b*c)/(8*a*a*a)
				const r = (16*a*a*b*b*c + 256*a*a*a*a*e - 3*a*b*b*b*b - 64*a*a*a*b*d)/(256*a*a*a*a*a)
				const [h0, h1, h2] = solve(1, 2*p, p*p - 4*r, -q*q)
				const s = or(h2, h0)
				if (s < epsilon) {
					const [f0, f1] = solve(1, p, r)
					if (!is(f1) || f1 < 0) {
						return []
					}
					else {
						const [f] = sqrt(f1)
						return [k - f, k + f]
					}
				}
				else {
					const h = sqrt(s)
					const f = (h*h*h + h*p - q)/(2*h)
					if (-epsilon < f && f < epsilon) {
						return [k - h, k]
					}
					else {
						const [r0, r1] = solve(1, h, f)
						const [r2, r3] = solve(1, -h, r/f)
						if (is(r0) && is(r2)) {
							return [k + r0, k + r1, k + r2, k + r3]
						}
						else if (is(r0)) {
							return [k + r0, k + r1]
						}
						else if (is(r2)) {
							return [k + r2, k + r3]
						}
						else {
							return []
						}
					}
				}
			}
			else if (is(d)) {
				const k = -b/(3*a)
				const p = (3*a*c - b*b)/(9*a*a)
				const q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(54*a*a*a)
				const r = p*p*p + q*q
				const s = sqrt(r) + q
				if (-epsilon < s && s < epsilon) {
					//p = 0
					if (q < 0) {
						return [k + cbrt(-2*q)]
					}
					else {
						return [k - cbrt(2*q)]
					}
				}
				else {
					if (r < 0) {
						const m = sqrt(-p)
						const d = atan2(sqrt(-r), q)/3
						const u = m*cos(d)
						const v = m*sin(d)
						// sqrt(3)
						return [k - 2*u, k + u - 1.7320508*v, k + u + 1.7320508*v]
					}
					else {
						if (s < 0) {
							const m = -cbrt(-s)
							return [k + p/m - m]
						}
						else {
							const m = cbrt(s)
							return [k + p/m - m]
						}
					}
				}
			}
			else if (is(c)) {
				const k = -b/(2*a)
				const u2 = k*k - c/a
				if (u2 < 0) {
					return []
				}
				else {
					const u = sqrt(u2)
					return [k - u, k + u]
				}
			}
			else if (is(b)) {
				return [-b/a]
			}
			else {
				return []
			}
		}
		Zeros.solve = solve
	}
}