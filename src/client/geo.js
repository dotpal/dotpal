const Geo = {}
{
	const PI = Math.PI
	const deg = PI/180
	const floor = Math.floor
	const IP = 1/PI
	const mod = (x, y) => {
		return x - floor(x/y)*y
	}
	Geo.link = (env) => {
		const State = env.require("State")
		Geo.create = (...args) => {
			const geo = {}
			const pin = document.createElement("img")
			pin.clasName = "pin"
			pin.src = "_include(pin.png)"
			pin.style.position = "fixed"
			pin.style.transform = "translate(-50%, -100%)"
			document.body.appendChild(pin)
			geo.position = State.create(([cx, cy]) => {
				pin.style.left = 100*IP*cy + "vh"
				pin.style.top = 100*IP*cx + "vh"
			})
			geo.request = () => {
				navigator.geolocation.getCurrentPosition((position) => {
					const cx = mod(0.5*PI - position.coords.latitude*deg, PI)
					const cy = mod(PI + position.coords.longitude*deg, 2*PI)
					geo.position.set([cx, cy])
				})
			}
			// geo.step = (dt) => {
			// 	cx += (1 - exp(-4*dt))*(cx- cx)
			// 	cy += (1 - exp(-4*dt))*(cy - cy)
			// 	pin.style.left = 100*(1 + IP*cy) + "vh"
			// 	pin.style.top = 100*(0.5 - IP*cx) + "vh"
			// }
			return geo
		}
	}
}