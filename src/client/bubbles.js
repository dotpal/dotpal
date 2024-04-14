const Bubbles = {}
{
	const random = Math.random
	const sqrt = Math.sqrt
	const exp = Math.exp
	const or = Logic.or
	const k = 4
	const get_bubble_to_bubble_force = (apx, apy, ar, bpx, bpy, br) => {
		const ox = bpx - apx
		const oy = bpy - apy
		const o = sqrt(ox*ox + oy*oy)
		const oux = ox/o
		const ouy = oy/o
		const px1 = apx + (o - (ar + br) - 0.1)*oux
		const py1 = apy + (o - (ar + br) - 0.1)*ouy
		return [k*(px1 - apx) - 0.1*apx, k*(py1 - apy) - 0.1*apy]
	}
	Bubbles.create = (camera) => {
		const bubbles = {}
		const all = []
		bubbles.click = Signal.create()
		const get_acting_force = (i0) => {
			if (all.length === 1) {
				return [0, 0]
			}
			const bubble0 = all[i0]
			const [px0, py0, r0] = bubble0.get_geometry()
			// forces against other bubbles
			let min_v = 1/0
			let min_i = 0
			for (let i1 = all.length; i1--;) {
				const [px1, py1, r1] = all[i1].get_geometry()
				if (i1 !== i0) {
					const distance = sqrt((px1 - px0)*(px1 - px0) + (py1 - py0)*(py1 - py0)) - r0 - r1
					if (distance < min_v) {
						min_v = distance
						min_i = i1
					}
				}
			}
			const [px1, py1, r1] = all[min_i].get_geometry()
			return get_bubble_to_bubble_force(px0, py0, r0, px1, py1, r1)
		}
		bubbles.create = (options) => {
			const bubble = {}
			let px = random()
			let py = random()
			let vx = 0
			let vy = 0
			let r = 1
			let fx, fy
			all.push(bubble)
			bubble.get_title = () => {
				return options.title
			}
			bubble.get_description = () => {
				return options.description
			}
			bubble.get_time = () => {
				return options.time
			}
			const link = document.createElement('a')
			document.body.appendChild(link)
			link.onclick = () => {
				bubbles.click.call(bubble)
			}
			const text = bubble.get_title()
			const sprite = document.createElement('bubble')
			sprite.textContent = text.split('\n')[0].substr(0, 12) // this cannot be textcontext
			link.appendChild(sprite)
			const present = () => {
				const [cpx, cpy, cpz] = camera.get_geometry()
				sprite.style.left = 100*(0.5*innerWidth/innerHeight + (px - r - cpx)/cpz) + 'vh' // fucking stupid percentages
				sprite.style.top = 100*(0.5 + (py - r - cpy)/cpz) + 'vh'
				sprite.style.width = 100*2*r/cpz + 'vh'
				sprite.style.height = 100*2*r/cpz + 'vh'
				sprite.style.lineHeight = 100*2*r/cpz + 'vh'
				sprite.style.fontSize = 100*0.3*r/cpz + 'vh'
				sprite.style.backgroundImage = 'url(_include(bubble.png))' // this is probably using a lot of memory
			}
			bubble.get_geometry = () => {
				return [px, py, r]
			}
			bubble.set_state = (px1, py1, vx1, vy1, r1) => {
				px = or(px1, px)
				py = or(py1, py)
				vx = or(vx1, vx)
				vy = or(vy1, vy)
				r = or(r1, r)
				present()
			}
			bubble.set_force = (fx1, fy1) => {
				fx = fx1
				fy = fy1
			}
			bubble.step = (dt) => {
				// double integrate constant acceleration to get position
				px = px + dt*vx + 0.5*dt*dt*fx
				py = py + dt*vy + 0.5*dt*dt*fy
				vx = vx + dt*fx
				vy = vy + dt*fy
				// present()
			}
			bubble.get_state = () => {
				return [px, py, vx, vy, r]
			}
			bubble.remove = () => {
				sprite.remove()
				all.splice(all.indexOf(bubble), 1)
			}
			return bubble
		}
		bubbles.step = (dt) => {
			// camera focus
			// maybe our code should be 'pull only' so we dont allow this pushing behavior
			for (let i = all.length; i--;) {
				const bubble = all[i]
				const [fx, fy] = get_acting_force(i)
				bubble.set_force(fx, fy)
				bubble.step(dt)
				const [px, py, vx, vy, r] = bubble.get_state()
				const h = exp(-dt)
				const elapsed = get_time() - bubble.get_time()
				bubble.set_state(undefined, undefined, h*vx, h*vy, exp(-0.00000001*elapsed))
				camera.push_focus_region(px, py, r)
			}
		}
		bubbles.clear = () => {
			for (const i in all) {
				all[i].remove()
			}
		}
		return bubbles
	}
}