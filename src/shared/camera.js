const Camera = {}
{
	const max = Math.max
	const min = Math.min
	const sqrt = Math.sqrt
	const link = (env) => {
		const Spring = env.require("Spring")
		const create = (...args) => {
			const camera = {}
			let subjects = []
			const px = Spring.create()
			const py = Spring.create()
			const pz = Spring.create()
			let ux
			let uy
			let lx
			let ly
			// onclick = () => {
			// 	if (event.target == env.documentElement) {
			// 		focus()
			// 	}
			// }
			const focus = (subjects1) => {
				if (subjects1) {
					subjects = subjects1
				}
				else {
					subjects = []
				}
			}
			const get_geometry = () => {
				return [px.get_position(), py.get_position(), pz.get_position()]
			}
			const step = (dt) => {
				if (subjects.length > 0) {
					ux = -1/0
					uy = -1/0
					lx = +1/0
					ly = +1/0
					for (const subject of subjects) {
						const [px, py, r] = subject.get_geometry()
						ux = max(ux, px + r)
						uy = max(uy, py + r)
						lx = min(lx, px - r)
						ly = min(ly, py - r)
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