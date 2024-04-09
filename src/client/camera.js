const Camera = {}
{
	const exp = Math.exp
	const max = Math.max
	const min = Math.min
	const sqrt = Math.sqrt
	Camera.create = function() {
		const self = {}
		let target = undefined
		let px1 = 0
		let py1 = 0
		let pz1 = 0
		let px = 0
		let py = 0
		let pz = 0
		let ux = -1/0
		let uy = -1/0
		let lx = +1/0
		let ly = +1/0
		let pushed = 0
		let go_away = false
		self.focus = function(subject) {
			target = subject
		}
		self.go_away = function() {
			go_away = true
		}
		self.come_back = function() {
			go_away = false
			px = 0
			py = 0
			pz = 0
		}
		self.get_geometry = function() {
			return [px, py, pz]
		}
		self.push_focus_region = function(x, y, r) {
			++pushed
			ux = max(ux, x + r)
			uy = max(uy, y + r)
			lx = min(lx, x - r)
			ly = min(ly, y - r)
		}
		self.pop_focus_regions = function() {
			px1 = 0.5*(lx + ux)
			py1 = 0.5*(ly + uy)
			pz1 = sqrt((ux - lx)*(ux - lx) + (uy - ly)*(uy - ly))
			ux = -1/0
			uy = -1/0
			lx = +1/0
			ly = +1/0
		}
		self.step = function(dt) {
			if (!go_away) {
				if (target !== undefined) {
					let r
					[px1, py1, r] = target.get_geometry()
					pz1 = 4*r
				}
				else if (pushed > 0) { // this is horrible lmao
					self.pop_focus_regions()
				}
				const h = exp(-4*dt)
				px = px1 + h*(px - px1)
				py = py1 + h*(py - py1)
				pz = pz1 + h*(pz - pz1)
			}
			else {
				px = 1000000
				py = 1000
				pz = 10
			}
			//document.body.style.backgroundPosition = 'center center'
			//document.body.style.backgroundPosition = -100*px/pz + 'vh' + ' ' + -100*py/pz + 'vh'
			//document.body.style.backgroundSize = 10*200/pz + 'vh'
			//document.body.style.transform = ''
			document.body.style.backgroundColor = '#e6e6e6'
			document.body.style.backgroundImage = 'url(_include(globe.png))'
			document.body.style.backgroundSize = '200vh'
		}
		return self
	}
}