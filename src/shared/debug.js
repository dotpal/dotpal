const Debug = {}
{
	const error = console.error
	const log = console.log
	const trace = console.trace
	const authorical = true
	const visual = true
	Debug.load = (env) => {
		onerror = (message, source, line, column, error) => {
			if (authorical) {
				draw(message)
			}
		}
		const draw = (...values) => {
			if (!typeof window) {
				for (let i = 0; i < values.length; ++i) {
					const message = values[i]
					const element = document.createElement('label')
					element.textContent = message
					document.body.appendChild(element)
				}
				document.body.appendChild(document.createElement('br'))
			}
		}
		Debug.log = (...values) => {
			log(...values)
		}
		Debug.error = (...values) => {
			if (visual) {
				draw(...values)
			}
			if (authorical) {
				trace(...values)
			}
		}
		/*
		Debug.point = (px, py) => {
			const [cpx, cpy, cpz] = Camera.get_geometry()
			const element = document.createElement('debug')
			element.style.left = 100*(0.5*innerWidth/innerHeight + (px - cpx)/cpz) + 'vh'
			element.style.top = 100*(0.5 + (py - cpy)/cpz) + 'vh'
			element.style.width = '0.5vh'
			element.style.height = '0.5vh'
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
			const t0 = env.get_time()
			benchy.end = () => {
				const t1 = env.get_time()
				Debug.log(name, t1 - t0)
			}
			return benchy
		}
	}
}