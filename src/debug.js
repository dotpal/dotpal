const Debug = {}
{
	const debug_mode = true
	if (which() === 'client') {
		onerror = function(message, source, line, column, error) {
			if (debug_mode) {
				Debug.output(message)
			}
		}
		Debug.output = function(message) {
			const element = document.createElement('label')
			element.textContent = message
			document.body.appendChild(element)
			document.body.appendChild(document.createElement('br'))
		}
		Debug.log = function(...values) {
			if (debug_mode) {
				console.log(...values)
			}
		}
		/*
		Debug.point = function(px, py) {
			const [cpx, cpy, cpz] = Camera.get_geometry()
			const element = document.createElement('debug')
			element.style.left = 100*(0.5*innerWidth/innerHeight + (px - cpx)/cpz) + 'vh'
			element.style.top = 100*(0.5 + (py - cpy)/cpz) + 'vh'
			element.style.width = '1vh'
			element.style.height = '1vh'
			document.body.appendChild(element)
		}
		*/
		Debug.point = function(px, py) {
			const element = document.createElement('debug')
			element.style.left = 100*px + 'vh'
			element.style.top = 100*py + 'vh'
			element.style.width = '1vh'
			element.style.height = '1vh'
			document.body.appendChild(element)
		}
	}
	else if (which() === 'server') {
		Debug.log = function(...values) {
			if (debug_mode) {
				console.log(...values)
			}
		}
	}
	Debug.benchmark = function(name) {
		const self = {}
		const t0 = performance.now()
		self.end = function() {
			const t1 = performance.now()
			Debug.log(name, t1 - t0, 'ms')
		}
		return self
	}
}