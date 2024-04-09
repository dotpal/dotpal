const GeoManager = {}
{
	const PI = Math.PI
	const deg = PI/180
	const floor = Math.floor
	const IP = 1/PI
	const exp = Math.exp
	const mod = function(x, y) {
		return x - floor(x/y)*y
	}
	GeoManager.create = function([cx, cy]) {
		const self = {}
		let [cx1, cy1] = [cx, cy]
		if (navigator.geolocation !== undefined) {
			navigator.geolocation.getCurrentPosition(function(position) {
				const cx = mod(position.coords.latitude*deg, PI)
				const cy = mod(position.coords.longitude*deg, PI) - PI
				self.set_target([cx, cy])
			})
		}
		else {
			Debug.log('geolocation is not supported by this browser') // this sounds like a bad assumption
		}
		const pin = document.createElement('img')
		pin.src = '_include(pin.png)'
		pin.style.position = 'fixed'
		pin.style.transform = 'translate(-50%, -100%)'
		document.body.appendChild(pin)
		self.set_target = function([cx1_, cy1_]) {
			cx1 = cx1_
			cy1 = cy1_
		}
		self.step = function(dt) {
			cx += (1 - exp(-4*dt))*(cx1 - cx)
			cy += (1 - exp(-4*dt))*(cy1 - cy)
			pin.style.left = 100*(1 + IP*cy) + 'vh'
			pin.style.top = 100*(0.5 - IP*cx) + 'vh'
		}
		self.get_coordinates = function() {
			return [cx1, cy1]
		}
		return self
	}
}