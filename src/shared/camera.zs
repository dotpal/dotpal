Camera = {}
{
	max = Math.max
	min = Math.min
	sqrt = Math.sqrt
	link = function(env) {
		Spring = env.require("Spring")
		create = function(...args) {
			camera = {}
			soft subjects = []
			// this might be wrong, dont make mutable?
			px = Spring.create()
			py = Spring.create()
			pz = Spring.create()
			// onclick = function() {
			// 	if event.target is env.documentElement {
			// 		focus()
			// 	}
			// }
			focus = function(subjects1) {
				if subjects1 {
					subjects = subjects1
				}
				else {
					subjects = []
				}
			}
			get_geometry = function() {
				return [px.get_position(), py.get_position(), pz.get_position()]
			}
			step = function(dt) {
				if subjects.length > 0 {
					soft ux = -1/0
					soft uy = -1/0
					soft lx = +1/0
					soft ly = +1/0
					for subject of subjects {
						[px, py, r] = subject.get_geometry()
						old ux = max(ux, px + r)
						old uy = max(uy, py + r)
						old lx = min(lx, px - r)
						old ly = min(ly, py - r)
					}
					px.set_target(0.5*(lx + ux))
					py.set_target(0.5*(ly + uy))
					pz.set_target(sqrt((ux - lx)*(ux - lx) + (uy - ly)*(uy - ly)))
				}
			}
			camera.focus = focus
			camera.get_geometry = get_geometry
			camera.step = step
			return camera
		}
		Camera.create = create
	}
	Camera.link = link
}