const GeoManager = {}
{
	const PI = Math.PI
	const deg = PI/180
	const floor = Math.floor
	const IP = 1/PI
	const exp = Math.exp
	const mod = (x, y) => {
		return x - floor(x/y)*y
	}
	GeoManager.create = () => {
		const self = {}
		let cx, cy
		self.position = State.create()
		const pin = document.createElement('img')
		pin.src = '_include(pin.png)'
		pin.style.position = 'fixed'
		pin.style.transform = 'translate(-50%, -100%)'
		document.body.appendChild(pin)
		const set_position = ([cx_, cy_]) => {
			cx = cx_
			cy = cy_
			pin.style.left = 100*(1 + IP*cy) + 'vh'
			pin.style.top = 100*(0.5 - IP*cx) + 'vh'
		}
		self.request = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					const cx = mod(position.coords.latitude*deg, PI)
					const cy = mod(position.coords.longitude*deg, PI) - PI
					set_position([cx, cy])
					self.position.set([cx, cy])
				})
			}
			else {
				Debug.log('geolocation is not supported by this browser') // this sounds like a bad assumption
			}
		}
		self.position.subscribe(set_position)
		// self.step = (dt) => {
		// 	cx += (1 - exp(-4*dt))*(cx- cx)
		// 	cy += (1 - exp(-4*dt))*(cy - cy)
		// 	pin.style.left = 100*(1 + IP*cy) + 'vh'
		// 	pin.style.top = 100*(0.5 - IP*cx) + 'vh'
		// }
		return self
	}
}