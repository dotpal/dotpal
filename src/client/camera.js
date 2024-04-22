const Camera = {}
{
	const exp = Math.exp
	const max = Math.max
	const min = Math.min
	const sqrt = Math.sqrt
	Camera.create = () => {
		const camera = {}
		let target
		const px = Spring.create()
		const py = Spring.create()
		const pz = Spring.create()
		let ux = -1/0
		let uy = -1/0
		let lx = +1/0
		let ly = +1/0
		let pushed = 0
		/*
		onclick = (event) => {
			if (event.target === document.documentElement) {
				camera.focus()
			}
		}
		*/
		camera.focus = (subject) => {
			target = subject
		}
		camera.get_geometry = () => {
			return [px.get_position(), py.get_position(), pz.get_position()]
		}
		camera.push = (x, y, r) => {
			++pushed
			ux = max(ux, x + r)
			uy = max(uy, y + r)
			lx = min(lx, x - r)
			ly = min(ly, y - r)
		}
		camera.pop = () => {
			px.set_target(0.5*(lx + ux))
			py.set_target(0.5*(ly + uy))
			pz.set_target(sqrt((ux - lx)*(ux - lx) + (uy - ly)*(uy - ly)))
			ux = -1/0
			uy = -1/0
			lx = +1/0
			ly = +1/0
		}
		camera.step = (dt) => {
			if (target) {
				const [px1, py1, r] = target.get_geometry()
				px.set_target(px1)
				py.set_target(py1)
				pz.set_target(4*r)
			}
			// this is horrible lmao
			else if (pushed > 0) {
				camera.pop()
			}
		}
		return camera
	}
}