Bubbles = {}
{
	sqrt = Math.sqrt
	exp = Math.exp
	get_bubble_to_bubble_target = function(apx, apy, ar, bpx, bpy, br) {
		ox = bpx - apx
		oy = bpy - apy
		o = sqrt(ox*ox + oy*oy)
		return [apx + (o - (ar + br))*ox/o, apy + (o - (ar + br))*oy/o]
	}
	link = function(env) {
		Signal = env.require("Signal")
		Spring = env.require("Spring")
		Viewer = env.require("Viewer")
		create = function(...args) {
			bubbles = {}
			all = []
			click = Signal.create()
			get_acting_target = function(ai) {
				[apx, apy, ra] = all[ai].get_geometry()
				soft min_value = 1/0
				soft min_index = 0
				for bi in all {
					if bi isnt ai {
						[bpx, bpy, br] = all[bi].get_geometry()
						distance = sqrt((bpx - apx)*(bpx - apx) + (bpy - apy)*(bpy - apy)) - ra - br
						if min_value > distance {
							min_value = distance
							min_index = bi
						}
					}
				}
				[bpx, bpy, br] = all[min_index].get_geometry()
				if all.length > 1 {
					return get_bubble_to_bubble_target(apx, apy, ra, bpx, bpy, br)
				}
				return [0, 0]
			}
			create = function(blub) {
				bubble = {}
				px = Spring.create()
				py = Spring.create()
				soft r = 1
				all.push(bubble)
				link = document.createElement("a")
				document.body.appendChild(link)
				link.onclick = function() {
					click.call(bubble)
				}
				sprite = document.createElement("bubble")
				sprite.textContent = blub.get_title().substr(0, 12)
				link.appendChild(sprite)
				present = function() {
					[cpx, cpy, cpz] = env.camera.get_geometry()
					// fucking stupid percentages
					sprite.style.left = 100*(0.5*innerWidth/innerHeight + (px.get_position() - r - cpx)/cpz) + "vh"
					sprite.style.top = 100*(0.5 + (py.get_position() - r - cpy)/cpz) + "vh"
					sprite.style.width = 100*2*r/cpz + "vh"
					sprite.style.height = 100*2*r/cpz + "vh"
					sprite.style.lineHeight = 100*2*r/cpz + "vh"
					sprite.style.fontSize = 100*0.3*r/cpz + "vh"
					// this is probably using a lot of memory
					// sprite.style.backgroundImage = "./bubble.png"
				}
				set_target = function(t) {
					[tx1, ty1] = t
					px.set_target(tx1)
					py.set_target(ty1)
				}
				get_geometry = function() {
					return [px.get_position(), py.get_position(), r]
				}
				set_radius = function(r1) {
					r = r1
				}
				step = function(dt) {
					px.step(dt)
					py.step(dt)
					present()
				}
				view = function() {
					Viewer.create(blub)
				}
				remove = function() {
					sprite.remove()
					all.splice(all.indexOf(bubble), 1)
				}
				bubble.blub = blub
				bubble.get_geometry = get_geometry
				bubble.remove = remove
				bubble.set_radius = set_radius
				bubble.set_target = set_target
				bubble.step = step
				bubble.view = view
				return bubble
			}
			step = function(dt) {
				// maybe our code should be "pull only" so we dont allow this pushing behavior
				for i in all {
					bubble = all[i]
					bubble.set_target(get_acting_target(i))
					bubble.step(dt)
					[px, py, r] = bubble.get_geometry()
					elapsed = env.get_time() - bubble.blub.get_time()
					// bubble.set_radius(exp(-0.00001*elapsed))
				}
			}
			clear = function() {
				for soft i = all.length; i--; {
					all[i].remove()
				}
			}
			bubbles.bubbles = all
			bubbles.click = click
			bubbles.create = create
			bubbles.step = step
			return bubbles
		}
		Bubbles.create = create
	}
	Bubbles.link = link
}