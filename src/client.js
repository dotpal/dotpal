'use strict'
async function digest_message(message) {
	const stream = new TextEncoder().encode(message) // encode as (utf-8) uint8array
	const hash = await crypto.subtle.digest('sha-256', stream) // hash the message
	const bytes = Array.from(new Uint8Array(hash)) // convert buffer to byte array
	const hex = bytes.map(function(b) {
		return b.toString(16).padStart(2, '0')
	}).join('') // convert bytes to hex string
	return hex
}
const debug = {}
{
	debug.point = function(px, py) {
		const project_scale = innerHeight/camera.pz
		const bubble_element = document.createElement('div')
		bubble_element.setAttribute('class', 'debug')
		bubble_element.style.left = 0.5*innerWidth + (px - camera.px)*project_scale + 'px'
		bubble_element.style.top = 0.5*innerHeight + (py - camera.py)*project_scale + 'px'
		bubble_element.style.width = '2px'
		bubble_element.style.height = '2px'
		document.body.appendChild(bubble_element)
	}
	debug.clear = function() {
	}
}
const logic = {}
{
	const is = function(v) {
		return v !== undefined
	}
	logic.is = is
	const and = function(a, b) {
		if (is(a) && is(b)) return b
	}
	logic.and = and
	const or = function(a, b) {
		if (is(a)) return a
		else if (is(b)) return b
	}
	logic.or = or
}
const spring = {}
{
	const cos = Math.cos
	const sin = Math.sin
	const exp = Math.exp
	const sqrt = Math.sqrt
	spring.create = function(p, v, k, d) {
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
// thanks to trey
const zeros = {}
{
	const sqrt = Math.sqrt
	const cbrt = Math.cbrt
	const or = logic.or
	const is = logic.is
	const epsilon = 1e-10
	// solve results are guaranteed real && sorted.
	const solve = function(a, b, c, d, e) {
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
	zeros.solve = solve
}
const cast = {}
{
	const sqrt = Math.sqrt
	cast.get_circle_onto_circle_intersection_time = function(apx, apy, avx, avy, ar, bpx, bpy, bvx, bvy, br) {
		const avav = avx*avx + avy*avy
		const avap = avx*apx + avy*apy
		const avbv = avx*bvx + avy*bvy
		const avbp = avx*bpx + avy*bpy
		const apap = apx*apx + apy*apy
		const apbp = apx*bpx + apy*bpy
		const bvap = bvx*apx + bvy*apy
		const bvbv = bvx*bvx + bvy*bvy
		const bvbp = bvx*bpx + bvy*bpy
		const bpbp = bpx*bpx + bpy*bpy
		/*
		const a = avav + 2*avbv + bvbv
		const b = avbp - bvap + bvbp - avap
		const c = 0.25*(apap - 2*apbp + bpbp - (ar + br)*(ar + br))
		const t = zeros.solve(a, -b, c)[0]
		//if (t < 0) console.log('uhhh t < 0')
		//*/
		const t = (-avap + avbp - bvap + bvbp - sqrt((avap - avbp + bvap - bvbp)*(avap - avbp + bvap - bvbp) - (avav + 2*avbv + bvbv)*(apap - 2*apbp + bpbp - (ar + br)*(ar + br))))/(avav + 2*avbv + bvbv)
		return t
	}
}
const shash = {}
{
	shash.shash1 = function(x) {
		return x
	}
	shash.shash2 = function(x, y) {
		return x + (x + y)*(x + y + 1)/2
	}
	shash.shash3 = function(x, y, z) {
		return x + (x + y)*(x + y + 1)/2 + (x + y + z)*(x + y + z + 1)*(x + y + z + 2)/6
	}
}
const camera = {}
{
	camera.px = 0
	camera.py = 0
	camera.pz = 16
	camera.focus = function(subject) {
		camera.target = subject
	}
	const t = 0
	{
		const sqrt = Math.sqrt
		const max = Math.max
		const min = Math.min
		let ux = -1/0
		let uy = -1/0
		let lx = +1/0
		let ly = +1/0
		camera.push_focus_region = function(x, y, r) {
			ux = max(ux, x + r)
			uy = max(uy, y + r)
			lx = min(lx, x - r)
			ly = min(ly, y - r)
		}
		camera.handle_focus_regions = function() {
			camera.px = 0.5*(lx + ux)
			camera.py = 0.5*(ly + uy)
			camera.pz = sqrt((ux - lx)*(ux - lx) + (uy - ly)*(uy - ly))
			ux = -1/0
			uy = -1/0
			lx = +1/0
			ly = +1/0
		}
	}
	const update = function(t) {
		//camera.px = 200*math.cos(1.2*t)
		//camera.py = 300*math.sin(t)
	}
	camera.step = function(dt) {
		t = t + dt
		update(t)
	}
}
const bubble = {}
{
	const random = Math.random
	const pow = Math.pow
	const pi = Math.PI
	const min = Math.min
	const sqrt = Math.sqrt
	const exp = Math.exp
	const or = logic.or
	const bubbles = []
	onclick = function(event) {
		if (event.target.tagName === 'HTML') {
			camera.focus(undefined)
		}
	}
	bubble.create = function(px, py, vx, vy, r, text, link) {
		const self = {}
		let fx, fy
		const link_element = document.createElement('a')
		link_element.href = link
		document.body.appendChild(link_element)
		link_element.onclick = function(event) {
			event.preventDefault()
			console.log('click bubble', text)
			camera.focus(self)
		}
		const bubble_element = document.createElement('div')
		bubble_element.setAttribute('class', 'bubble')
		bubble_element.innerHTML = text
		link_element.appendChild(bubble_element)
		const present = function() {
			const project_scale = innerHeight/camera.pz
			bubble_element.style.left = 0.5*innerWidth + (px - r - camera.px)*project_scale + 'px'
			bubble_element.style.top = 0.5*innerHeight + (py - r - camera.py)*project_scale + 'px'
			bubble_element.style.width = 2*r*project_scale + 'px'
			bubble_element.style.height = 2*r*project_scale + 'px'
			bubble_element.style.lineHeight = 2*r*project_scale + 'px'
			bubble_element.style.fontSize = 0.3*r*project_scale + 'px'
		}
		self.present = present
		self.get_geometry = function() {
			return [px, py, r]
		}
		self.set_state = function(px1, py1, vx1, vy1, r1, text1, link1) {
			px = or(px1, px)
			py = or(py1, py)
			vx = or(vx1, vx)
			vy = or(vy1, vy)
			r = or(r1, r)
			text = or(text1, text)
			link = or(link1, link)
			present()
		}
		self.set_force = function(fx1, fy1) {
			fx = fx1
			fy = fy1
		}
		self.step = function(dt) {
			/*
			// position_0
			const px0 = px
			const py0 = py
			// integrate constant acceleration to get position
			px = px + dt*vx + 0.5*dt*dt*fx
			py = py + dt*vy + 0.5*dt*dt*fy
			// d position
			const dpx = px - px0
			const dpy = py - py0
			console.log(dpx, dt*vx)
			vx = vx + dt*fx
			vy = vy + dt*fy
			// minimize intersection time in the set of all intersections
			const t = 1e12
			*/
			// double integrate constant acceleration to get position
			px = px + dt*vx + 0.5*dt*dt*fx
			py = py + dt*vy + 0.5*dt*dt*fy
			vx = vx + dt*fx
			vy = vy + dt*fy
			/*
			for (let i = bubbles.length; i--;) {
				const bubbleb = bubbles[i]
				const [px]
				const t1 = cast.get_circle_onto_circle_intersection_time(px0, py0, dpx, dpy, r)
				t = min(t1, t)
			}
			*/
			present()
		}
		self.constrict = function() {
			if (px > innerWidth - r) {
				px = innerWidth - r
				vx = 0
			}
			if (py > innerHeight - r) {
				py = innerHeight - r
				vy = 0
			}
			if (px < r) {
				px = r
				vx = 0
			}
			if (py < r) {
				py = r
				vx = 0
			}
		}
		self.get_state = function() {
			return [px, py, vx, vy, r, text, link]
		}
		self.destroy = function() {
		}
		bubbles.push(self)
		return self
	}
	const k = 4
	const get_bubble_to_bubble_force = function(apx, apy, ar, bpx, bpy, br) {
		/*
		const ox = bpx - apx
		const oy = bpy - apy
		const o = sqrt(ox*ox + oy*oy) || 1
		const oux = -ox/o
		const ouy = -oy/o
		const r = ar + br
		const d = o - r
		if (o > r) {
			d = pow(d, 0.3)
			//d = max(0, d)
			return [k*oux/d, k*ouy/d]
		}
		else {
			return [k*oux, k*ouy]
		}
		//*/
		/*
		const ox = bpx - apx
		const oy = bpy - apy
		const o = sqrt(ox*ox + oy*oy) || 1
		const oux = -ox/o
		const ouy = -oy/o
		const d = o
		d = pow(d, 0.3)
		//d = max(0, d)
		return [k*oux/d, k*ouy/d]
		/*/
		//return [-k*apx, -k*apy]
		const ox = bpx - apx
		const oy = bpy - apy
		const o = sqrt(ox*ox + oy*oy)
		const oux = ox/o
		const ouy = oy/o
		const px1 = apx + (o - (ar + br) - 0.1)*oux
		const py1 = apy + (o - (ar + br) - 0.1)*ouy
		//debug.point(apx, apy)
		return [k*(px1 - apx) - 0.1*apx, k*(py1 - apy) - 0.1*apy]
		//return [k*(bpx - apx), k*(bpy - apy)]
	}
	const get_acting_force = function(i0) {
		//*
		//const sfx = 0
		//const sfy = 0
		const bubble0 = bubbles[i0]
		const [px0, py0, r0] = bubble0.get_geometry()
		// forces against other bubbles
		let min_v = 1/0
		let min_i = undefined
		for (let i1 = bubbles.length; i1--;) {
			const [px1, py1, r1] = bubbles[i1].get_geometry()
			if (i1 !== i0) {
				const distance = sqrt((px1 - px0)*(px1 - px0) + (py1 - py0)*(py1 - py0)) - r0 - r1
				if (distance < min_v) {
					min_v = distance
					min_i = i1
				}
				/*
				const bubble1 = bubbles[i1]
				const [px1, py1, r1] = bubble1.get_geometry()
				const [fx, fy] = get_bubble_to_bubble_force(px0, py0, r0, px1, py1, r1)
				sfx += fx
				sfy += fy
				*/
			}
		}
		const [px1, py1, r1] = bubbles[min_i].get_geometry()
		return get_bubble_to_bubble_force(px0, py0, r0, px1, py1, r1)
		//*/
		// forces against walls
		/*
		{
			const [fx, fy] = get_bubble_to_bubble_force(px0, py0, r0, innerWidth, py0, 0)
			sfx += fx
			sfy += fy
		}
		{
			const [fx, fy] = get_bubble_to_bubble_force(px0, py0, r0, px0, innerHeight, 0)
			sfx += fx
			sfy += fy
		}
		{
			const [fx, fy] = get_bubble_to_bubble_force(px0, py0, r0, 0, py0, 0)
			sfx += fx
			sfy += fy
		}
		{
			const [fx, fy] = get_bubble_to_bubble_force(px0, py0, r0, px0, 0, 0)
			sfx += fx
			sfy += fy
		}
		*/
		// return sum of forces
		//return [sfx, sfy]
	}
	const epsilon = 1e-4
	bubble.step = function(dt) {
		//*
		//const displacements = []
		// physics step
		for (let i = bubbles.length; i--;) {
			const bubble = bubbles[i]
			// position_0
			//const [px0, py0] = bubble.get_geometry()
			//const [fx, fy] = get_bubble_to_bubble_force(px0, py0)
			const [fx, fy] = get_acting_force(i)
			bubble.set_force(fx, fy)
			bubble.step(dt)
			// optionally constraint the bubble into the viewport
			//bubble.constrict()
			/*
			const [px, py, r] = bubble.get_geometry()
			// d position
			const dpx = px - px0
			const dpy = py - py0
			// add the displaced region to the displacement list
			displacements[i] = [px0, py0, dpx, dpy, r]
			*/
		}
		//*/
		/*
		// collision step
		for (let i = bubbles.length; i--;) {
			// minimize intersection time in the set of all intersections
			const [apx0, apy0, adpx, adpy, ar] = displacements[i]
			// we're assuming dp = v, so p0 + vt = p1 and position at t = 1 is p1, so all possible collisions lie within 0 <= t <= 1
			// but we dont need to change anything if the resulting t is more than 1, because we are not predicting the future
			const t = 1
			for (let j = bubbles.length; j--;) {
				if (j !== i) {
					const [bpx0, bpy0, bdpx, bdpy, br] = displacements[j]
					const th = cast.get_circle_onto_circle_intersection_time(apx0, apy0, adpx, adpy, ar, bpx0, bpy0, bdpx, bdpy, br)
					if (th >= 0) {
						t = min(t, th) // the number which is likely to be minimized should be the first argument probably
					}
				}
			}
			// there was a collision
			if (t < 1) {
				bubbles[i].set_state(apx0 + t*adpx, apy0 + t*adpy, undefined, undefined, ar)
			}
		}
		//*/
		/*
		// more collision
		for (let i = bubbles.length; i--;) {
			const bubble_i = bubbles[i]
			const [apx, apy, avx, avy, ar] = bubble_i.get_state()
			for (let j = bubbles.length; j--;) {
				if (j !== i) {
					const bubble_j = bubbles[j]
					const [bpx, bpy, bvx, bvy, br] = bubble_j.get_state()
					const ox = bpx - apx
					const oy = bpy - apy
					const ol = sqrt(ox*ox + oy*oy)
					// overlapping condition
					if (ol < ar + br + epsilon) {
						apx = bpx - ox/ol*(ar + br)
						apy = bpy - oy/ol*(ar + br)
						const ov = ox*avx + oy*avy
						avx -= ov*ox/ol
						avy -= ov*oy/ol
					}
				}
			}
			bubble_i.set_state(apx, apy, avx, avy)
		}
		//*/
		/*
		// og
		for (let i = bubbles.length; i--;) {
			bubbles[i].step(dt)
			bubbles[i].constrict()
		}
		//*/
		/*
		// idk approximate vx and vy
		const [px, py] = bubbles[i].get_state()
		bubbles[i].set_state(undefined, undefined, (px - px0)/dt, (py - py0)/dt)
		//*/
		// camera focus
		for (let i = bubbles.length; i--;) {
			const [px, py, vx, vy, r] = bubbles[i].get_state()
			bubbles[i].set_state(undefined, undefined, exp(-dt)*vx, exp(-dt)*vy)
			camera.push_focus_region(px, py, r)
		}
		if (camera.target) {
				const [px, py] = camera.target.get_state()
				camera.px = px
				camera.py = py
		}
		else {
			camera.handle_focus_regions()
		}
	}
}
const signal = {}
{
	signal.create = function() {
		const self = {}
		const events = []
		self.connect = function(callback) {
			events.push(callback)
			return function() {
				events.splice(events.indexOf(callback), 1)
			}
		}
		self.send = function(values) {
			for (const i in events) {
				events[i](values)
			}
		}
		return self
	}
}
const network = {}
{
	network.create = function(port) {
		const self = {}
		self.open = signal.create()
		self.close = signal.create()
		self.error = signal.create()
		const socket = new WebSocket('ws://localhost:' + port)
		// these are needed to automatically call the bindings open close and error
		socket.onopen = self.open.send
		socket.onclose = self.close.send
		socket.onerror = self.error.send
		const listeners = {}
		self.receive = function(key) {
			if (listeners[key]) {
				return listeners[key]
			}
			return listeners[key] = signal.create()
		}
		socket.message = function(packet) {
			const [key, ...values] = JSON.parse(packet.data)
			if (listeners[key]) {
				listeners[key].send(values)
			}
			else {
				console.log('no key: ' + key)
			}
		}
		self.send = function(values) {
			socket.send(JSON.stringify(values))
		}
		return self
	}
}
{
	const random = Math.random
	const sqrt = Math.sqrt
	const the_network = network.create(3565)
	the_network.open.connect(function() {
		console.log('connected to network')
		the_network.send('lmfao')
		const receive_cookie = signal.create()
		const login_form = document.createElement('form')
		login_form.setAttribute('id', 'login_form')
		const username_label = document.createElement('label')
		username_label.textContent = 'email'
		const username_input = document.createElement('input')
		username_input.setAttribute('id', 'username')
		username_input.setAttribute('name', 'username')
		username_input.setAttribute('required', 'true')
		username_input.setAttribute('type', 'text')
		const password_label = document.createElement('label')
		password_label.textContent = 'password'
		const password_input = document.createElement('input')
		password_input.setAttribute('id', 'password')
		password_input.setAttribute('name', 'password')
		password_input.setAttribute('required', 'true')
		password_input.setAttribute('type', 'password')
		const submit_button = document.createElement('input')
		submit_button.setAttribute('type', 'submit')
		submit_button.setAttribute('value', 'login')
		login_form.appendChild(username_label)
		login_form.appendChild(username_input)
		login_form.appendChild(password_label)
		login_form.appendChild(password_input)
		login_form.appendChild(submit_button)
		document.body.appendChild(login_form)
		document.querySelector('#login_form').addEventListener('submit', function(event) {
			event.preventDefault() // prevent the login form from submitting
			const username = document.querySelector('#username').value
			const password = document.querySelector('#password').value
			if (username === '' || password === '') {
				alert('please enter both username and password')
				return
			}
			digest_message(username + password).then(function(secret) {
				document.cookie = secret
				receive_cookie.send([secret])
			})
		})
		function get_location() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					console.log(position)
				})
			}
			else {
				alert('geolocation is not supported by this browser')
			}
		}
		{
			receive_cookie.connect(function([secret]) {
				login_form.remove()
				the_network.send(['login', secret])
			})
			if (document.cookie) {
				receive_cookie.send([document.cookie])
			}
		}
		{
			const floor = Math.floor
			const min = Math.min
			const random = Math.random
			const sqrt = Math.sqrt
			const bubble_count = floor(6 + 24*random())
			for (let i = bubble_count; i--;) {
				bubble.create(sqrt(bubble_count)*random(), sqrt(bubble_count)*random(), 0, 0, sqrt(random()), i, 'http://je.gy')
			}
			let t0 = 0.001*performance.now()
			const render = function() {
				const t = 0.001*performance.now()
				const dt = min(t - t0, 0.03)
				t0 = t
				bubble.step(dt)
				requestAnimationFrame(render)
			}
			requestAnimationFrame(render)
		}
	})
}