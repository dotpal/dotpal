const Bubbles = {}
{
	const sqrt = Math.sqrt
	const exp = Math.exp
	const get_bubble_to_bubble_target = (apx, apy, ar, bpx, bpy, br) => {
		const ox = bpx - apx
		const oy = bpy - apy
		const o = sqrt(ox*ox + oy*oy)
		return [apx + (o - (ar + br))*ox/o, apy + (o - (ar + br))*oy/o]
	}
	Bubbles.link = (env) => {
		const Signal = env.require("Signal")
		const Spring = env.require("Spring")
		const Viewer = env.require("Viewer")
		Bubbles.create = (...args) => {
			const bubbles = {}
			const all = []
			bubbles.bubbles = all
			bubbles.click = Signal.create()
			const get_acting_target = (ai) => {
				const [apx, apy, ra] = all[ai].get_geometry()
				let min_value = 1/0
				let min_index = 0
				for (const bi in all) {
					if (bi != ai) {
						const [bpx, bpy, br] = all[bi].get_geometry()
						const distance = sqrt((bpx - apx)*(bpx - apx) + (bpy - apy)*(bpy - apy)) - ra - br
						if (min_value > distance) {
							min_value = distance
							min_index = bi
						}
					}
				}
				const [bpx, bpy, br] = all[min_index].get_geometry()
				if (all.length > 1) {
					return get_bubble_to_bubble_target(apx, apy, ra, bpx, bpy, br)
				}
				return [0, 0]
			}
			bubbles.create = (blub) => {
				const bubble = {}
				bubble.blub = blub
				let px = Spring.create()
				let py = Spring.create()
				let r = 1
				all.push(bubble)
				const link = document.createElement("a")
				document.body.appendChild(link)
				link.onclick = () => {
					bubbles.click.call(bubble)
				}
				const sprite = document.createElement("bubble")
				sprite.textContent = blub.title.substr(0, 12)
				link.appendChild(sprite)
				const present = () => {
					const [cpx, cpy, cpz] = env.camera.get_geometry()
					// fucking stupid percentages
					sprite.style.left = 100*(0.5*innerWidth/innerHeight + (px.get_position() - r - cpx)/cpz) + "vh"
					sprite.style.top = 100*(0.5 + (py.get_position() - r - cpy)/cpz) + "vh"
					sprite.style.width = 100*2*r/cpz + "vh"
					sprite.style.height = 100*2*r/cpz + "vh"
					sprite.style.lineHeight = 100*2*r/cpz + "vh"
					sprite.style.fontSize = 100*0.3*r/cpz + "vh"
					// this is probably using a lot of memory
					// sprite.style.backgroundImage = "url(_include(bubble.png))"
				}
				bubble.set_target = (t) => {
					const [tx1, ty1] = t
					px.set_target(tx1)
					py.set_target(ty1)
				}
				bubble.get_geometry = () => {
					return [px.get_position(), py.get_position(), r]
				}
				bubble.set_radius = (r1) => {
					r = r1
				}
				bubble.step = (dt) => {
					px.step(dt)
					py.step(dt)
					present()
				}
				bubble.view = () => {
					Viewer.create(blub)
				}
				bubble.remove = () => {
					sprite.remove()
					all.splice(all.indexOf(bubble), 1)
				}
				return bubble
			}
			bubbles.step = (dt) => {
				// maybe our code should be "pull only" so we dont allow this pushing behavior
				for (const i in all) {
					const bubble = all[i]
					bubble.set_target(get_acting_target(i))
					bubble.step(dt)
					const [px, py, r] = bubble.get_geometry()
					const elapsed = env.get_time() - bubble.blub.time
					// bubble.set_radius(exp(-0.00001*elapsed))
				}
			}
			bubbles.clear = () => {
				for (let i = all.length; i--;) {
					all[i].remove()
				}
			}
			return bubbles
		}
	}
}