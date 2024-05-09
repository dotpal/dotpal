const Debug = {}
{
	const error = console.error
	const log = console.log
	const trace = console.trace
	const authorical = true
	const visual = true
	Debug.load = (env) => {
		Debug.create = () => {
			const debug = {}
			onerror = (message, source, line, column, error) => {
				if (authorical) {
					draw(message)
				}
			}
			const draw = (...values) => {
				if (!typeof window) {
					for (let i = 0; i < values.length; ++i) {
						const message = values[i]
						const element = env.createElement('label')
						element.textContent = message
						env.body.appendChild(element)
					}
					env.body.appendChild(env.createElement('br'))
				}
			}
			const print = (...values) => {
				log(...values)
			}
			debug.print = print
			debug.error = (...values) => {
				if (visual) {
					draw(...values)
				}
				if (authorical) {
					trace(...values)
				}
			}
			/*
			debug.point = (px, py) => {
				const [cpx, cpy, cpz] = Camera.get_geometry()
				const element = env.createElement('debug')
				element.style.left = 100*(0.5*innerWidth/innerHeight + (px - cpx)/cpz) + 'vh'
				element.style.top = 100*(0.5 + (py - cpy)/cpz) + 'vh'
				element.style.width = '0.5vh'
				element.style.height = '0.5vh'
				env.body.appendChild(element)
			}
			*/
			debug.point = (px, py) => {
				const element = env.createElement('debug')
				element.style.left = 100*px + 'vh'
				element.style.top = 100*py + 'vh'
				element.style.width = '0.5vh'
				element.style.height = '0.5vh'
				env.body.appendChild(element)
			}
			debug.benchmark = (name) => {
				const benchy = {}
				const t0 = env.get_time()
				benchy.end = () => {
					const t1 = env.get_time()
					print(name, t1 - t0)
				}
				return benchy
			}
			return debug
		}
	}
}