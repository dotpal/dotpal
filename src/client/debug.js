const Debug = {}
{
	const error = console.error
	const log = console.log
	const trace = console.trace
	const authorical = true
	const visual = false
	const create = () => {
		const debug = {}
		const draw = (...args) => {
			for (const message of args) {
				const element = document.createElement("label")
				element.textContent = message
				document.body.appendChild(element)
				const space = document.createElement("label")
				space.textContent = " "
				document.body.appendChild(space)
			}
			document.body.appendChild(document.createElement("br"))
		}
		const print = (...args) => {
			log(...args)
			if (visual) {
				draw(...args)
			}
		}
		const assert = (value, message) => {
			if (value != true) {
				trace(message)
			}
		}
		const bug = (...args) => {
			error(...args)
			// if (visual) {
			// 	draw(...args)
			// }
			// if (authorical) {
			// 	trace(...args)
			// }
		}
		/*
		const point = (px, py) => {
			const [cpx, cpy, cpz] = Camera.get_geometry()
			const element = document.createElement("debug")
			element.style.left = 100*(0.5*innerWidth/innerHeight + (px - cpx)/cpz) + "vh"
			element.style.top = 100*(0.5 + (py - cpy)/cpz) + "vh"
			element.style.width = "0.5vh"
			element.style.height = "0.5vh"
			document.body.appendChild(element)
		}
		*/
		const point = (px, py) => {
			const element = document.createElement("debug")
			element.style.left = 100*px + "vh"
			element.style.top = 100*py + "vh"
			element.style.width = "0.5vh"
			element.style.height = "0.5vh"
			document.body.appendChild(element)
		}
		const benchmark = (name) => {
			const benchy = {}
			const t0 = get_time()
			benchy.end = () => {
				const t1 = get_time()
				print(name, t1 - t0)
			}
			return benchy
		}
		onerror = (message, source, line, column, error_message) => {
			// error("Terminating Error:", message)
			// trace(message)
			if (authorical) {
				draw(message)
			}
		}
		debug.assert = assert
		debug.benchmark = benchmark
		debug.bug = bug
		debug.draw = draw
		debug.point = point
		debug.print = print
		debug.trace = trace
		return debug
	}
	Debug.create = create
}