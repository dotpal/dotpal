const Camera = {}
{
	const max = Math.max
	const min = Math.min
	const sqrt = Math.sqrt
	Camera.link = (env) => {
		const Spring = env.require('Spring')
		Camera.create = () => {
			const camera = {}
			let subjects = []
			const px = Spring.create()
			const py = Spring.create()
			const pz = Spring.create()
			let ux
			let uy
			let lx
			let ly
			/*
			onclick = (event) => {
				if (event.target == env.documentElement) {
					camera.focus()
				}
			}
			*/
			camera.focus = (subjects1) => {
				if (subjects1) {
					subjects = subjects1
				}
				else {
					subjects = []
				}
			}
			camera.get_geometry = () => {
				return [px.get_position(), py.get_position(), pz.get_position()]
			}
			camera.step = (dt) => {
				if (subjects.length > 0) {
					ux = -1/0
					uy = -1/0
					lx = +1/0
					ly = +1/0
					for (const i in subjects) {
						const subject = subjects[i]
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
			return camera
		}
	}
}