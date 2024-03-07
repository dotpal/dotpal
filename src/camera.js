const camera = {}
{
	const exp = Math.exp
	const max = Math.max
	const min = Math.min
	const sqrt = Math.sqrt
	let target = undefined
	let px1 = 0
	let py1 = 0
	let pz1 = 5
	let px = 0
	let py = 0
	let pz = 5
	let ux = -1/0
	let uy = -1/0
	let lx = +1/0
	let ly = +1/0
	let pushed = 0
	camera.focus = function(subject) {
		//debug.log('focus', subject)
		target = subject
	}
	camera.get_geometry = function() {
		return [px, py, pz]
	}
	camera.push_focus_region = function(x, y, r) {
		++pushed
		ux = max(ux, x + r)
		uy = max(uy, y + r)
		lx = min(lx, x - r)
		ly = min(ly, y - r)
	}
	camera.pop_focus_regions = function() {
		px1 = 0.5*(lx + ux)
		py1 = 0.5*(ly + uy)
		pz1 = sqrt((ux - lx)*(ux - lx) + (uy - ly)*(uy - ly))
		ux = -1/0
		uy = -1/0
		lx = +1/0
		ly = +1/0
	}
	camera.step = function(dt) {
		if (target !== undefined) {
			[px1, py1] = target.get_geometry()
		}
		else if (pushed > 0) { // this is horrible lmao
			camera.pop_focus_regions()
		}
		const h = exp(-4*dt)
		px = px1 + h*(px - px1)
		py = py1 + h*(py - py1)
		pz = pz1 + h*(pz - pz1)
		//update(t)
	}
}