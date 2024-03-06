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
			const [cpx, cpy, cpz] = camera.get_geometry()
			const project_scale = innerHeight/cpz
			bubble_element.style.left = 0.5*innerWidth + (px - r - cpx)*project_scale + 'px'
			bubble_element.style.top = 0.5*innerHeight + (py - r - cpy)*project_scale + 'px'
			bubble_element.style.width = 2*r*project_scale + 'px'
			bubble_element.style.height = 2*r*project_scale + 'px'
			bubble_element.style.lineHeight = 2*r*project_scale + 'px'
			bubble_element.style.fontSize = 0.3*r*project_scale + 'px'
			bubble_element.style['background-image'] = 'url(INCLUDE(bubble.png))' // this is probably using a lot of memory
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
			const h = exp(-dt)
			bubbles[i].set_state(undefined, undefined, h*vx, h*vy)
			camera.push_focus_region(px, py, r)
		}
	}
}