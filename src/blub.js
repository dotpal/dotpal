const Blub = {}
{
	if (Which() === 'client') {
		const random = Math.random
		const pow = Math.pow
		const pi = Math.PI
		const min = Math.min
		const sqrt = Math.sqrt
		const exp = Math.exp
		const or = Logic.or
		const blubs = []
		onclick = function(event) {
			if (event.target.tagName === 'HTML') {
				Camera.focus(undefined)
			}
		}
		const k = 4
		const get_blub_to_blub_force = function(apx, apy, ar, bpx, bpy, br) {
			const ox = bpx - apx
			const oy = bpy - apy
			const o = sqrt(ox*ox + oy*oy)
			const oux = ox/o
			const ouy = oy/o
			const px1 = apx + (o - (ar + br) - 0.1)*oux
			const py1 = apy + (o - (ar + br) - 0.1)*ouy
			//Debug.point(apx, apy)
			return [k*(px1 - apx) - 0.1*apx, k*(py1 - apy) - 0.1*apy]
			//return [k*(bpx - apx), k*(bpy - apy)]
		}
		const get_acting_force = function(i0) {
			if (blubs.length === 1) {
				return [0, 0]
			}
			const blub0 = blubs[i0]
			const [px0, py0, r0] = blub0.get_geometry()
			// forces against other blubs
			let min_v = 1/0
			let min_i = 0
			for (let i1 = blubs.length; i1--;) {
				const [px1, py1, r1] = blubs[i1].get_geometry()
				if (i1 !== i0) {
					const distance = sqrt((px1 - px0)*(px1 - px0) + (py1 - py0)*(py1 - py0)) - r0 - r1
					if (distance < min_v) {
						min_v = distance
						min_i = i1
					}
				}
			}
			const [px1, py1, r1] = blubs[min_i].get_geometry()
			return get_blub_to_blub_force(px0, py0, r0, px1, py1, r1)
		}
		Blub.open = function(blub) {
			let editor = undefined
			if (blub === undefined) {
				editor = true
			}
			else {
				editor = false
			}
			Camera.focus(blub)
			const container = document.createElement('container')
			document.body.appendChild(container)
			const form = document.createElement('form')
			container.appendChild(form)
			const icon = document.createElement('img')
			icon.src = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			form.appendChild(icon)
			const title = document.createElement('textarea')
			title.cols = 25
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
			if (blub) {
				title.value = blub.get_title()
				description.value = blub.get_description()
			}
			const close_menu = function() {
				container.remove()
				Camera.focus(undefined)
			}
			if (editor) {
				const publish = document.createElement('button')
				publish.innerHTML = 'publish'
				form.appendChild(publish)
				form.onsubmit = function(event) {
					event.preventDefault()
					close_menu()
					const options = {}
					options.description = description.value
					options.title = title.value
					//Debug.log(User.get_id)
					//options.user = User.get_id()
					Blub.create(options)
				}
			}
			const close = document.createElement('button')
			close.innerHTML = 'close'
			form.appendChild(close)
			close.onclick = function(event) {
				close_menu()
			}
			container.onclick = function(event) {
				if (event.target === container) {
					close_menu()
				}
			}
		}
		Blub.step = function(dt) {
			for (let i = blubs.length; i--;) {
				const blub = blubs[i]
				const [fx, fy] = get_acting_force(i)
				blub.set_force(fx, fy)
				blub.step(dt)
			}
			// camera focus
			// maybe our code should be "pull only" so we dont allow this pushing behavior
			for (let i = blubs.length; i--;) {
				const [px, py, vx, vy, r] = blubs[i].get_state()
				const h = exp(-dt)
				blubs[i].set_state(undefined, undefined, h*vx, h*vy)
				Camera.push_focus_region(px, py, r)
			}
		}
		Blub.create = function(options, local) {
			if (local === undefined) {
				local = false
				Network.send(['blub', options])
			}
			else {
				local = true
			}
			const self = {}
			let px = random()
			let py = random()
			let vx = 0
			let vy = 0
			let r = 1
			let fx, fy
			const link = document.createElement('a')
			document.body.appendChild(link)
			blubs.push(self)
			self.get_title = function() {
				return options.title
			}
			self.get_description = function() {
				return options.description
			}
			link.onclick = function(event) {
				Blub.open(self)
			}
			const text = self.get_title()
			const blub = document.createElement('blub')
			blub.innerHTML = text.split('\n')[0].substr(0, 12) // this cannot be textcontext
			link.appendChild(blub)
			self.present = function() {
				const [cpx, cpy, cpz] = Camera.get_geometry()
				blub.style.left = 100*(0.5*innerWidth/innerHeight + (px - r - cpx)/cpz) + 'vh' // fucking stupid percentages
				blub.style.top = 100*(0.5 + (py - r - cpy)/cpz) + 'vh'
				blub.style.width = 100*2*r/cpz + 'vh'
				blub.style.height = 100*2*r/cpz + 'vh'
				blub.style.lineHeight = 100*2*r/cpz + 'vh'
				blub.style.fontSize = 100*0.3*r/cpz + 'vh'
				blub.style.backgroundImage = 'url(_include(blub.png))' // this is probably using a lot of memory
			}
			self.get_geometry = function() {
				return [px, py, r]
			}
			self.set_state = function(px1, py1, vx1, vy1, r1) {
				px = or(px1, px)
				py = or(py1, py)
				vx = or(vx1, vx)
				vy = or(vy1, vy)
				r = or(r1, r)
				//self.present()
			}
			self.set_force = function(fx1, fy1) {
				fx = fx1
				fy = fy1
			}
			self.step = function(dt) {
				// double integrate constant acceleration to get position
				px = px + dt*vx + 0.5*dt*dt*fx
				py = py + dt*vy + 0.5*dt*dt*fy
				vx = vx + dt*fx
				vy = vy + dt*fy
				self.present()
			}
			self.get_state = function() {
				return [px, py, vx, vy, r]
			}
			self.remove = function() {
				blub.remove()
				blubs.splice(blubs.indexOf(self), 1)
			}
			return self
		}
		const create = document.createElement('button')
		create.innerHTML = 'create'
		document.body.appendChild(create)
		create.onclick = function() {
			Blub.open()
		}
		Network.receive('blub').subscribe(function([peer, options]) {
			Blub.create(options, null)
		})
	}
	else if (Which() === 'server') {
		const fs = require('fs')
		const path = require('path')
		Network.receive('blub').subscribe(function([peer, options]) {
			Debug.log('receive time is', new Date().getTime())
			fs.writeFileSync('blub/' + Math.random(), JSON.stringify(options))
			Network.send_but(peer, ['blub', options])
		})
		Network.connect.subscribe(function([peer]) {
			const folder = 'blub'
			const files = fs.readdirSync(folder)
			files.forEach(function(file) {
				const full = path.join(folder, file)
				const options = JSON.parse(fs.readFileSync(full, 'utf8'))
				Network.share(peer, ['blub', options])
			})
		})
	}
}