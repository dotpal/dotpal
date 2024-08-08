Geo = {}
{
	PI = Math.PI
	deg = PI/180
	floor = Math.floor
	IP = 1/PI
	mod = function(x, y) {
		return x - floor(x/y)*y
	}
	link = function(env) {
		State = env.require("State")
		create = function(...args) {
			geo = {}
			pin = document.createElement("img")
			pin.clasName = "pin"
			pin.src = "./pin.png"
			pin.style.position = "fixed"
			pin.style.transform = "translate(-50%, -100%)"
			document.body.appendChild(pin)
			position = State.create(function([cx, cy]) {
				pin.style.left = 100*IP*cy + "vh"
				pin.style.top = 100*IP*cx + "vh"
			})
			request = function() {
				navigator.geolocation.getCurrentPosition(function(position) {
					cx = mod(0.5*PI - position.coords.latitude*deg, PI)
					cy = mod(PI + position.coords.longitude*deg, 2*PI)
					position.set([cx, cy])
				})
			}
			// step = function(dt) {
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