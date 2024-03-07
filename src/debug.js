const debug = {}
{
	const debug_mode = true
	if (which() === 'client') {
		onerror = function(message, source, line, column, error) {
			debug.output(message)
		}
		debug.output = function(message) {
			const element = document.createElement('label')
			element.textContent = message
			document.body.appendChild(element)
			document.body.appendChild(document.createElement('br'))
		}
		debug.log = function(...values) {
			if (debug_mode) {
				console.log(...values)
				debug.output(...values)
			}
		}
		debug.point = function(px, py) {
			const [cpx, cpy, cpz] = camera.get_geometry()
			const element = document.createElement('debug')
			element.style.left = 100*(0.5*innerWidth/innerHeight + (px - cpx)/cpz) + 'vh'
			element.style.top = 100*(0.5 + (py - cpy)/cpz) + 'vh'
			element.style.width = '1vh'
			element.style.height = '1vh'
			document.body.appendChild(element)
		}
	}
	else if (which() === 'server') {
		debug.log = function(...values) {
			if (debug_mode) {
				console.log(...values)
			}
		}
	}
	debug.benchmark = function(name) {
		const self = {}
		const t0 = performance.now()
		self.end = function() {
			const t1 = performance.now()
			debug.log(name, t1 - t0, 'ms')
		}
		return self
	}
}