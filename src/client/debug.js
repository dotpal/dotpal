const Debug = {}
{
	const debug_mode = true
	onerror = (message, source, line, column, error) => {
		if (debug_mode) {
			Debug.output(message)
		}
	}
	Debug.output = (message) => {
		const element = document.createElement('label')
		element.textContent = message
		document.body.appendChild(element)
		document.body.appendChild(document.createElement('br'))
	}
	Debug.log = (...values) => {
		if (debug_mode) {
			console.log(...values)
		}
	}
	Debug.error = (...values) => {
		console.error(...values)
	}
	/*
	Debug.point = (px, py) => {
		const [cpx, cpy, cpz] = Camera.get_geometry()
		const element = document.createElement('debug')
		element.style.left = 100*(0.5*innerWidth/innerHeight + (px - cpx)/cpz) + 'vh'
		element.style.top = 100*(0.5 + (py - cpy)/cpz) + 'vh'
		element.style.width = '1vh'
		element.style.height = '1vh'
		document.body.appendChild(element)
	}
	*/
	Debug.point = (px, py) => {
		const element = document.createElement('debug')
		element.style.left = 100*px + 'vh'
		element.style.top = 100*py + 'vh'
		element.style.width = '0.5vh'
		element.style.height = '0.5vh'
		document.body.appendChild(element)
	}
	Debug.benchmark = (name) => {
		const benchy = {}
		const t0 = get_time()
		benchy.end = () => {
			const t1 = get_time()
			Debug.log(name, t1 - t0, 'ms')
		}
		return benchy
	}
}