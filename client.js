'use strict'

async function digestMessage(message) {
	const	msgUint8 = new TextEncoder().encode(message); // encode	as (utf-8) Uint8Array
	const	hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
	const	hashArray =	Array.from(new Uint8Array(hashBuffer));	// convert buffer to byte array
	const	hashHex	= hashArray
	.map((b) =>	b.toString(16).padStart(2, '0'))
	.join(''); // convert bytes	to hex string
	return hashHex;
}









let	debug =	{}
{
	debug.point	= function(px, py) {
		let	project_scale =	innerHeight/camera.pz

		let	bubble_element = document.createElement('div')
		bubble_element.setAttribute('class', 'debug')
		bubble_element.style.left =	0.5*innerWidth + (px - camera.px)*project_scale	+ 'px'
		bubble_element.style.top = 0.5*innerHeight + (py - camera.py)*project_scale	+ 'px'
		bubble_element.style.width = '2px'
		bubble_element.style.height	= '2px'
		document.body.appendChild(bubble_element)
	}

	debug.clear	= function() {
	}
}

let	logic =	{}
{
	let	is = function(v) {
		return v !=	null
	}
	logic.is = is

	let	and	= function(a, b) {
		if (is(a) && is(b))	return b
	}
	logic.and =	and

	let	or = function(a, b)	{
		if (is(a)) return a
		else if	(is(b))	return b
	}
	logic.or = or
}

let	spring = {}
{
	let	cos	= Math.cos
	let	sin	= Math.sin
	let	exp	= Math.exp
	let	sqrt = Math.sqrt

	spring.new = function(p, v,	k, d) {
		let	self = {}

		let	t =	0

		self.step =	function(dt) {
			t += dt
		}

		self.update	= function(t1) {
			t =	t1
		}

		self.evaluate =	function() {
			let	h =	sqrt(1 - d*d)
			let	t =	t*h*k // not really	correct	but	whatever
			let	s =	sin(t)
			let	c =	h*cos(t) //	not	really c, more like	hc
			let	y =	h*exp(d*t/h) //	more like hy i guess
			// assuming	k >	0 && d < 1
			return [b +	(k*(p -	b)*(c +	d*s) + v*s)/(k*y), (k*(b - p)*s	+ v*(c - d*s))/y]
		}

		return self
	}
}

// Thanks to Trey
let	zeros =	{}
{
	let	sqrt = Math.sqrt
	let	cbrt = Math.cbrt
	let	or = logic.or
	let	is = logic.is

	let	err	= 1e-10

	// Solve results are guaranteed	real &&	sorted.
	let	solve =	function(a,	b, c, d, e)	{
		if (is(a) && -err <	a && a < err) {
			return solve(b,	c, d, e)
		}
		else if	(is(e))	{
			let	k =	-b/(4*a)
			let	p =	(8*a*c - 3*b*b)/(8*a*a)
			let	q =	(b*b*b + 8*a*a*d - 4*a*b*c)/(8*a*a*a)
			let	r =	(16*a*a*b*b*c +	256*a*a*a*a*e -	3*a*b*b*b*b	- 64*a*a*a*b*d)/(256*a*a*a*a*a)
			let	[h0, h1, h2] = solve(1,	2*p, p*p - 4*r,	-q*q)
			let	s =	or(h2, h0)
			if (s <	err) {
				let	[f0, f1] = solve(1,	p, r)
				if (!is(f1)	|| f1 <	0) {
					return []
				}
				else {
					let	[f]	= sqrt(f1)
					return [k -	f, k + f]
				}
			}
			else {
				let	h =	sqrt(s)
				let	f =	(h*h*h + h*p - q)/(2*h)
				if (-err < f &&	f <	err) {
					return [k -	h, k]
				}
				else {
					let	[r0, r1] = solve(1,	h, f)
					let	[r2, r3] = solve(1,	-h,	r/f)
					if (is(r0) && is(r2)) {
						return [k +	r0,	k +	r1,	k +	r2,	k +	r3]
					}
					else if	(is(r0)) {
						return [k +	r0,	k +	r1]
					}
					else if	(is(r2)) {
						return [k +	r2,	k +	r3]
					}
					else {
						return []
					}
				}
			}
		}
		else if	(is(d))	{
			let	k =	-b/(3*a)
			let	p =	(3*a*c - b*b)/(9*a*a)
			let	q =	(2*b*b*b - 9*a*b*c + 27*a*a*d)/(54*a*a*a)
			let	r =	p*p*p +	q*q
			let	s =	sqrt(r)	+ q
			if (-err < s &&	s <	err) {
				//p	= 0
				if (q <	0) {
					return [k +	cbrt(-2*q)]
				}
				else {
					return [k -	cbrt(2*q)]
				}
			}
			else {
				if (r <	0) {
					let	m =	sqrt(-p)
					let	d =	atan2(sqrt(-r),	q)/3
					let	u =	m*cos(d)
					let	v =	m*sin(d)
					// sqrt(3)
					return [k -	2*u, k + u - 1.7320508*v, k	+ u	+ 1.7320508*v]
				}
				else {
					if (s <	0) {
						let	m =	-cbrt(-s)
						return [k +	p/m	- m]
					}
					else {
						let	m =	cbrt(s)
						return [k +	p/m	- m]
					}
				}
			}
		}
		else if	(is(c))	{
			let	k =	-b/(2*a)
			let	u2 = k*k - c/a
			if (u2 < 0)	{
				return []
			}
			else {
				let	u =	sqrt(u2)
				return [k -	u, k + u]
			}
		}
		else if	(is(b))	{
			return [-b/a]
		}
		else {
			return []
		}
	}

	zeros.solve = solve
}

let	cast = {}
{
	let	sqrt = Math.sqrt

	cast.get_circle_onto_circle_intersection_time =	function(apx, apy, avx,	avy, ar, bpx, bpy, bvx,	bvy, br) {
		let	avav = avx*avx + avy*avy
		let	avap = avx*apx + avy*apy
		let	avbv = avx*bvx + avy*bvy
		let	avbp = avx*bpx + avy*bpy
		let	apap = apx*apx + apy*apy
		let	apbp = apx*bpx + apy*bpy
		let	bvap = bvx*apx + bvy*apy
		let	bvbv = bvx*bvx + bvy*bvy
		let	bvbp = bvx*bpx + bvy*bpy
		let	bpbp = bpx*bpx + bpy*bpy
		/*
		let	a =	avav + 2*avbv +	bvbv
		let	b =	avbp - bvap	+ bvbp - avap
		let	c =	0.25*(apap - 2*apbp	+ bpbp - (ar + br)*(ar + br))
		let	t =	zeros.solve(a, -b, c)[0]
		//if (t	< 0) console.log('uhhh t < 0...')
		//*/
		let	t =	(-avap + avbp -	bvap + bvbp	- sqrt((avap - avbp	+ bvap - bvbp)*(avap - avbp	+ bvap - bvbp) - (avav + 2*avbv	+ bvbv)*(apap -	2*apbp + bpbp -	(ar	+ br)*(ar +	br))))/(avav + 2*avbv +	bvbv)
		return t
	}
}

let	shash =	{}
{
	shash.shash1 = function(x) {
		return x
	}

	shash.shash2 = function(x, y) {
		return x + (x +	y)*(x +	y +	1)/2
	}

	shash.shash3 = function(x, y, z) {
		return x + (x +	y)*(x +	y +	1)/2 + (x +	y +	z)*(x +	y +	z +	1)*(x +	y +	z +	2)/6
	}
}

let	camera = {}
{
	camera.px =	0
	camera.py =	0
	camera.pz =	16

	camera.focus = function(subject) {
			console.log('focus camera on', subject)
			camera.target = subject
	}

	let	t =	0

	{
		let	sqrt = Math.sqrt
		let	max	= Math.max
		let	min	= Math.min

		let	ux = -1/0
		let	uy = -1/0
		let	lx = +1/0
		let	ly = +1/0

		camera.push_focus_region = function(x, y, r) {
			ux = max(ux, x + r)
			uy = max(uy, y + r)
			lx = min(lx, x - r)
			ly = min(ly, y - r)
		}

		camera.handle_focus_regions	= function() {
			camera.px =	0.5*(lx	+ ux)
			camera.py =	0.5*(ly	+ uy)
			camera.pz =	sqrt((ux - lx)*(ux - lx) + (uy - ly)*(uy - ly))

			ux = -1/0
			uy = -1/0
			lx = +1/0
			ly = +1/0
		}
	}

	let	update = function(t) {
		//camera.px	= 200*Math.cos(1.2*t)
		//camera.py	= 300*Math.sin(t)
	}

	camera.step	= function(dt) {
		t =	t +	dt
		update(t)
	}
}

let	bubble = {}
{
	let	random = Math.random
	let	pow	= Math.pow
	let	pi = Math.PI
	let	min	= Math.min
	let	sqrt = Math.sqrt
	let	exp	= Math.exp
	let	or = logic.or

	let	bubbles	= []
	onclick = function(event) {
			if (event.target.tagName == 'HTML') {
					camera.focus(null)
			}
		}
	bubble.new = function(px, py, vx, vy, r, text, link) {
		let	self = {}

		let	fx,	fy

		let	link_element = document.createElement('a')
		link_element.href =	link
		document.body.appendChild(link_element)
		link_element.onclick = function(event) {
				event.preventDefault()
				console.log('click bubble', text)
				camera.focus(self)
		}


		let	bubble_element = document.createElement('div')
		bubble_element.setAttribute('class', 'bubble')
		bubble_element.innerHTML = text
		link_element.appendChild(bubble_element)

		let	present	= function() {
			let	project_scale =	innerHeight/camera.pz
			bubble_element.style.left =	0.5*innerWidth + (px - r - camera.px)*project_scale	+ 'px'
			bubble_element.style.top = 0.5*innerHeight + (py - r - camera.py)*project_scale	+ 'px'
			bubble_element.style.width = 2*r*project_scale + 'px'
			bubble_element.style.height	= 2*r*project_scale	+ 'px'
			bubble_element.style.lineHeight	= 2*r*project_scale	+ 'px'
			bubble_element.style.fontSize =	0.3*r*project_scale	+ 'px'
		}
		self.present = present

		self.get_geometry =	function() {
			return [px,	py,	r]
		}

		self.set_state = function(px1, py1,	vx1, vy1, r1, text1, link1)	{
			px = or(px1, px)
			py = or(py1, py)
			vx = or(vx1, vx)
			vy = or(vy1, vy)
			r =	or(r1, r)
			text = or(text1, text)
			link = or(link1, link)
			present()
		}

		self.set_force = function(fx1, fy1)	{
			fx = fx1
			fy = fy1
		}

		self.step =	function(dt) {
			/*
			// position_0
			let	px0	= px
			let	py0	= py
			// integrate constant acceleration to get position
			px = px	+ dt*vx	+ 0.5*dt*dt*fx
			py = py	+ dt*vy	+ 0.5*dt*dt*fy
			// d position
			let	dpx	= px - px0
			let	dpy	= py - py0
			console.log(dpx, dt*vx)
			vx = vx	+ dt*fx
			vy = vy	+ dt*fy
			// minimize	intersection time in the set of	all	intersections
			let	t =	1e12
			*/
			// double integrate	constant acceleration to get position
			px = px	+ dt*vx	+ 0.5*dt*dt*fx
			py = py	+ dt*vy	+ 0.5*dt*dt*fy
			vx = vx	+ dt*fx
			vy = vy	+ dt*fy
			/*
			for	(let i = bubbles.length; i--;) {
				let	bubbleb	= bubbles[i]
				let	[px]
				let	t1 = cast.get_circle_onto_circle_intersection_time(px0,	py0, dpx, dpy, r)
				t =	min(t1,	t)
			}
			*/
			present()
		}

		self.constrict = function()	{
			if (px > innerWidth	- r) {
				px = innerWidth	- r
				vx = 0
			}
			if (py > innerHeight - r) {
				py = innerHeight - r
				vy = 0
			}
			if (px < r)	{
				px = r
				vx = 0
			}
			if (py < r)	{
				py = r
				vx = 0
			}
		}

		self.get_state = function()	{
			return [px,	py,	vx,	vy,	r, text, link]
		}

		self.destroy = function() {

		}

		bubbles.push(self)

		return self
	}

	let	k =	4

	let	get_bubble_to_bubble_force = function(apx, apy,	ar,	bpx, bpy, br) {
		/*
		let	ox = bpx - apx
		let	oy = bpy - apy
		let	o =	sqrt(ox*ox + oy*oy)	|| 1
		let	oux	= -ox/o
		let	ouy	= -oy/o
		let	r =	ar + br
		let	d =	o -	r
		if (o >	r) {
			d =	pow(d, 0.3)
			//d	= max(0, d)
			return [k*oux/d, k*ouy/d]
		}
		else {
			return [k*oux, k*ouy]
		}
		//*/
		/*
		let	ox = bpx - apx
		let	oy = bpy - apy
		let	o =	sqrt(ox*ox + oy*oy)	|| 1
		let	oux	= -ox/o
		let	ouy	= -oy/o
		let	d =	o
		d =	pow(d, 0.3)
		//d	= max(0, d)
		return [k*oux/d, k*ouy/d]
		/*/
		//return [-k*apx, -k*apy]
		let	ox = bpx - apx
		let	oy = bpy - apy
		let	o =	sqrt(ox*ox + oy*oy)
		let	oux	= ox/o
		let	ouy	= oy/o
		let	px1	= apx +	(o - (ar + br) - 0.1)*oux
		let	py1	= apy +	(o - (ar + br) - 0.1)*ouy
		//debug.point(apx, apy)
		return [k*(px1 - apx) -	0.1*apx, k*(py1	- apy) - 0.1*apy]
		//return [k*(bpx - apx), k*(bpy	- apy)]
	}

	let	get_acting_force = function(i0)	{
		//*
		//let sfx =	0
		//let sfy =	0
		let	bubble0	= bubbles[i0]
		let	[px0, py0, r0] = bubble0.get_geometry()
		// Forces against other	bubbles
		let	min_v =	1/0
		let	min_i
		for	(let i1	= bubbles.length; i1--;) {
			let	[px1, py1, r1] = bubbles[i1].get_geometry()
			if (i1 != i0) {
				let	distance = sqrt((px1 - px0)*(px1 - px0)	+ (py1 - py0)*(py1 - py0)) - r0	- r1
				if (distance < min_v) {
					min_v =	distance
					min_i =	i1
				}
				/*
				let	bubble1	= bubbles[i1]
				let	[px1, py1, r1] = bubble1.get_geometry()
				let	[fx, fy] = get_bubble_to_bubble_force(px0, py0,	r0,	px1, py1, r1)
				sfx	+= fx
				sfy	+= fy
				*/
			}
		}
		let	[px1, py1, r1] = bubbles[min_i].get_geometry()
		return get_bubble_to_bubble_force(px0, py0,	r0,	px1, py1, r1)
		//*/
		// Forces against walls
		/*
		{
			let	[fx, fy] = get_bubble_to_bubble_force(px0, py0,	r0,	innerWidth,	py0, 0)
			sfx	+= fx
			sfy	+= fy
		}
		{
			let	[fx, fy] = get_bubble_to_bubble_force(px0, py0,	r0,	px0, innerHeight, 0)
			sfx	+= fx
			sfy	+= fy
		}
		{
			let	[fx, fy] = get_bubble_to_bubble_force(px0, py0,	r0,	0, py0,	0)
			sfx	+= fx
			sfy	+= fy
		}
		{
			let	[fx, fy] = get_bubble_to_bubble_force(px0, py0,	r0,	px0, 0,	0)
			sfx	+= fx
			sfy	+= fy
		}
		*/
		// Return sum of forces
		return [sfx, sfy]
	}

	let	err	= 1e-4

	bubble.step	= function(dt) {
		//*
		//let displacements	= []
		// physics step
		for	(let i = bubbles.length; i--;) {
			let	bubble = bubbles[i]
			// position_0
			//let [px0,	py0] = bubble.get_geometry()
			//let [fx, fy] = get_bubble_to_bubble_force(px0, py0)
			let	[fx, fy] = get_acting_force(i)
			bubble.set_force(fx, fy)
			bubble.step(dt)
			// optionally constraint the bubble	into the viewport
			//bubble.constrict()
			/*
			let	[px, py, r]	= bubble.get_geometry()
			// d position
			let	dpx	= px - px0
			let	dpy	= py - py0
			// add the displaced region	to the displacement	list
			displacements[i] = [px0, py0, dpx, dpy,	r]
			*/
		}
		//*/
		/*
		// collision step
		for	(let i = bubbles.length; i--;) {
			// minimize	intersection time in the set of	all	intersections
			let	[apx0, apy0, adpx, adpy, ar] = displacements[i]
			// we're assuming dp = v, so p0	+ vt = p1 and position at t	= 1	is p1, so all possible collisions lie within 0 <= t	<= 1
			// but we dont need	to change anything if the resulting	t is more than 1, because we are not predicting	the	future
			let	t =	1
			for	(let j = bubbles.length; j--;) {
				if (j != i)	{
					let	[bpx0, bpy0, bdpx, bdpy, br] = displacements[j]
					let	th = cast.get_circle_onto_circle_intersection_time(apx0, apy0, adpx, adpy, ar, bpx0, bpy0, bdpx, bdpy, br)
					if (th >= 0) {
						t =	min(t, th) // the number which is likely to	be minimized should	be the first argument probably
					}
				}
			}
			// there was a collision
			if (t <	1) {
				//console.log(i, t)
				bubbles[i].set_state(apx0 +	t*adpx,	apy0 + t*adpy, null, null, ar)
				//console.log(bubbles[i].get_state()[2])
			}
		}
		//*/
		/*
		// more	collision...
		for	(let i = bubbles.length; i--;) {
			let	bubble_i = bubbles[i]
			let	[apx, apy, avx,	avy, ar] = bubble_i.get_state()
			for	(let j = bubbles.length; j--;) {
				if (j != i)	{
					let	bubble_j = bubbles[j]
					let	[bpx, bpy, bvx,	bvy, br] = bubble_j.get_state()
					let	ox = bpx - apx
					let	oy = bpy - apy
					let	ol = sqrt(ox*ox	+ oy*oy)
					// overlapping condition
					if (ol < ar	+ br + err)	{
						apx	= bpx -	ox/ol*(ar +	br)
						apy	= bpy -	oy/ol*(ar +	br)
						let	ov = ox*avx	+ oy*avy
						//console.log(ov)
						avx	-= ov*ox/ol
						avy	-= ov*oy/ol
					}
				}
			}
			bubble_i.set_state(apx,	apy, avx, avy)
		}
		//*/
		/*
		// og
		for	(let i = bubbles.length; i--;) {
			bubbles[i].step(dt)
			bubbles[i].constrict()
		}
		//*/
		/*
		// idk approximate vx and vy
		let	[px, py] = bubbles[i].get_state()
		bubbles[i].set_state(null, null, (px - px0)/dt,	(py	- py0)/dt, null)
		//*/
		// camera focus
		for	(let i = bubbles.length; i--;) {
			let	[px, py, vx, vy, r]	= bubbles[i].get_state()
			bubbles[i].set_state(null, null, exp(-dt)*vx, exp(-dt)*vy)
			camera.push_focus_region(px, py, r)
		}
		if (camera.target) {
				let [px, py] = camera.target.get_state()
				camera.px = px
				camera.py = py
		}
		else {
			camera.handle_focus_regions()
		}
	}
}





function newSignal() {
	let	signal = {}
	let	events = []
	signal.connect = func => {
		events.push(func)
		return () =>
			events.splice(events.indexOf(func),	1)
	}
	signal.fire	= args => {
		for	(let i in events)
			events[i](args)
	}
	return signal
}



function newNetwork(port) {
	let	network	= {}
	network.open = newSignal()
	network.close =	newSignal()
	network.error =	newSignal()
	//let socket = new WebSocket('wss://home.blocksrey.com:' + port)
	let	socket = new WebSocket('ws://localhost:' + port)
	socket.onopen =	network.open.fire
	socket.onclose = network.close.fire
	socket.onerror = network.error.fire
	let	listeners =	{}
	network.receive	= key => {
		if (listeners[key])
			return listeners[key]
		return listeners[key] =	newSignal()
	}
	socket.onmessage = packet => {
		let	[key, ...args] = JSON.parse(packet.data)
		if (listeners[key])
			listeners[key].fire(args)
		else
			console.log('no key: ' + key)
	}
	network.send = params =>
		socket.send(JSON.stringify(params))
	return network
}
let	rand = Math.random
let	sqrt = Math.sqrt
let	network	= newNetwork(3565)

network.open.connect(function()	{
	console.log('connected to network')
	network.send('lmfao')
	//network.send(['fetch', 'mario.obj'])
	//network.receive('fetch').connect(main)
		let	on_receive_cookie =	newSignal()
	var	form = document.createElement('form');
	form.setAttribute('id',	'loginForm');
	// Create username input field
	var	usernameLabel =	document.createElement('label');
	usernameLabel.textContent =	'Email';
	var	usernameInput =	document.createElement('input');
	usernameInput.setAttribute('type', 'text');
	usernameInput.setAttribute('id', 'username');
	usernameInput.setAttribute('name', 'username');
	usernameInput.setAttribute('required', 'true');
	// Create password input field
	var	passwordLabel =	document.createElement('label');
	passwordLabel.textContent =	'Password';
	var	passwordInput =	document.createElement('input');
	passwordInput.setAttribute('type', 'password');
	passwordInput.setAttribute('id', 'password');
	passwordInput.setAttribute('name', 'password');
	passwordInput.setAttribute('required', 'true');
	// Create submit button
	var	submitButton = document.createElement('input');
	submitButton.setAttribute('type', 'submit');
	submitButton.setAttribute('value', 'Login');
	// Append elements to form
	form.appendChild(usernameLabel);
	form.appendChild(usernameInput);
	form.appendChild(passwordLabel);
	form.appendChild(passwordInput);
	form.appendChild(submitButton);
	// Append form to the body of the document
	document.body.appendChild(form);
	// Function	to handle form submission
	document.getElementById('loginForm').addEventListener('submit',	function(event)	{
		event.preventDefault();	// Prevent the form	from submitting
		// Retrieve	the	username and password
		var	username = document.getElementById('username').value;
		var	password = document.getElementById('password').value;
		// Perform basic validation
		if (username === '	|| password	===	')	{
			alert('Please enter	both username and password.');
			return;
		}
		digestMessage(username + password).then((secret) =>	{
			document.cookie	= secret
			on_receive_cookie.fire([secret])
		});
	});
		function getLocation() {
				if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(position) {
								console.log(position)
						});
				} else {
						alert('Geolocation is not supported by this browser.');
				}
		}
		on_receive_cookie.connect(function([secret]) {
				//console.log('receive secret', secret)
				form.remove()
				console.log('form removed')
			network.send(['login', secret])
		})
		if (document.cookie) {
			on_receive_cookie.fire([document.cookie])
		}



		{
			let	random = Math.random
			let	sqrt = Math.sqrt

			let	bubble_count = Math.floor(6	+ 24*random())
			for	(let i = bubble_count; i--;) {
				bubble.new(sqrt(bubble_count)*random(),	sqrt(bubble_count)*random(), 0,	0, sqrt(random()), i, 'http://je.gy')
			}

			let	t0 = 0.001*performance.now()
			let	render = function()	{
				let	t =	0.001*performance.now()
				let	dt = Math.min(t - t0, 0.03)
				t0 = t
				bubble.step(dt)
				requestAnimationFrame(render)
			}
			requestAnimationFrame(render)
		}

})
