const Geo = {}
{
	const PI = Math.PI
	const deg = PI/180
	const floor = Math.floor
	const IP = 1/PI
	const mod = (x, y) => {
		return x - floor(x/y)*y
	}
	const link = (env) => {
		const State = env.require("State")
		const create = (...args) => {
			const geo = {}
			const pin = document.createElement("img")
			pin.clasName = "pin"
			pin.src = "_include(pin.png)"
			pin.style.position = "fixed"
			pin.style.transform = "translate(-50%, -100%)"
			document.body.appendChild(pin)
			const position = State.create(([cx, cy]) => {
				pin.style.left = 100*IP*cy + "vh"
				pin.style.top = 100*IP*cx + "vh"
			})
			const request = () => {
				navigator.geolocation.getCurrentPosition((position) => {
					const cx = mod(0.5*PI - position.coords.latitude*deg, PI)
					const cy = mod(PI + position.coords.longitude*deg, 2*PI)
					position.set([cx, cy])
				})
			}
			// const step = (dt) => {
			// 	cx += (1 - exp(-4*dt))*(cx1 - cx)
			// 	cy += (1 - exp(-4*dt))*(cy1 - cy)
			// 	pin.style.left = 100*(1 + IP*cy) + "vh"
			// 	pin.style.top = 100*(0.5 - IP*cx) + "vh"
			// }
			geo.position = position
			geo.request = request
			return geo
		}
		Geo.create = create
	}
	Geo.link = link
}