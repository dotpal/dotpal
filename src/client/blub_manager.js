const PostViewer = {}
{
	const random = Math.random
	const pow = Math.pow
	const pi = Math.PI
	const min = Math.min
	const sqrt = Math.sqrt
	const exp = Math.exp
	const or = Logic.or
	PostViewer.create = (camera) => {
		const viewer = {}
		viewer.open = Signal.create()
		viewer.submit = Signal.create()
		const bubbles = []
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
		const get_acting_force = (i0) => {
			if (bubbles.length === 1) {
				return [0, 0]
			}
			const bubble0 = bubbles[i0]
			const [px0, py0, r0] = bubble0.get_geometry()
			// forces against other bubbles
			let min_v = 1/0
			let min_i = 0
			for (let i1 = bubbles.length; i1--;) {
				const [px1, py1, r1] = bubbles[i1].get_geometry()
				if (i1 !== i0) {
					const distance = sqrt((px1 - px0)*(px1 - px0) + (py1 - py0)*(py1 - py0)) - r0 - r1
					if (distance < min_v) {
						min_v = distance
						min_i = i1
					}
				}
			}
			const [px1, py1, r1] = bubbles[min_i].get_geometry()
			return get_bubble_to_bubble_force(px0, py0, r0, px1, py1, r1)
		}
		viewer.open.subscribe((bubble) => {
			let editor
			// more likely to view posts than create them
			if (!bubble) {
				editor = true
			}
			else {
				editor = false
			}
			camera.focus(bubble)
			const container = document.createElement('div')
			document.body.appendChild(container)
			const form = document.createElement('form')
			container.appendChild(form)
			const icon = document.createElement('img')
			icon.src = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			form.appendChild(icon)
			const title = document.createElement('textarea')
			title.cols = 24
			title.placeholder = 'title'
			title.readOnly = !editor
			title.required = true
			title.rows = 1
			form.appendChild(title)
			form.appendChild(document.createElement('br'))
			const description = document.createElement('textarea')
			description.cols = 32
			description.placeholder = 'description'
			description.readOnly = !editor
			description.required = true
			description.rows = 24
			form.appendChild(description)
			form.appendChild(document.createElement('br'))
			if (bubble) {
				title.value = bubble.get_title()
				description.value = bubble.get_description()
			}
			viewer.close = () => {
				container.remove()
				camera.focus()
			}
			const close = document.createElement('button')
			close.textContent = 'close'
			form.appendChild(close)
			close.onclick = (event) => {
				viewer.close()
			}
			container.onclick = (event) => {
				if (event.target === container) {
					viewer.close()
				}
			}
			if (editor) {
				const publish = document.createElement('button')
				publish.textContent = 'publish'
				form.appendChild(publish)
				form.onsubmit = (event) => {
					event.preventDefault()
					const options = {}
					options.description = description.value
					options.title = title.value
					viewer.submit.call(options)
				}
			}
			else {
				/*
				const comments = document.createElement('form')
				container.appendChild(comments)
				const comment = document.createElement('p')
				comment.textContent = 'comment'
				comments.appendChild(comment)
				*/
				const reply = document.createElement('button')
				reply.textContent = 'reply'
				reply.onclick = (event) => {
					event.preventDefault()
				}
				form.appendChild(reply)
			}
		})
		viewer.step = (dt) => {
			// camera focus
			// maybe our code should be 'pull only' so we dont allow this pushing behavior
			for (let i = bubbles.length; i--;) {
				const bubble = bubbles[i]
				const [fx, fy] = get_acting_force(i)
				bubble.set_force(fx, fy)
				bubble.step(dt)
				const [px, py, vx, vy, r] = bubble.get_state()
				const h = exp(-dt)
				const elapsed = new Date().getTime() - bubble.get_time()
				bubble.set_state(undefined, undefined, h*vx, h*vy, exp(-0.0000001*elapsed))
				camera.push_focus_region(px, py, r)
			}
		}
		viewer.clear = () => {
			for (const i in bubbles) {
				bubbles[i].remove()
			}
		}
		const create = document.createElement('button')
		create.textContent = 'create'
		document.body.appendChild(create)
		create.onclick = () => {
			viewer.open.call()
		}
		viewer.create = (options) => {
			const bubble = {}
			let px = random()
			let py = random()
			let vx = 0
			let vy = 0
			let r = 1
			let fx, fy
			const link = document.createElement('a')
			document.body.appendChild(link)
			bubbles.push(bubble)
			bubble.get_title = () => {
				return options.title
			}
			bubble.get_description = () => {
				return options.description
			}
			bubble.get_time = () => {
				return options.time
			}
			link.onclick = (event) => {
				viewer.open.call(bubble)
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
				bubbles.splice(bubbles.indexOf(bubble), 1)
			}
			return bubble
		}
		return viewer
	}
}