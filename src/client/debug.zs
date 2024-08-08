Debug = {}
{
	error = console.error
	log = console.log
	trace = console.trace
	authorical = true
	visual = false
	NL = String.fromCharCode(10)
	{
		originalConsoleError = console.error
		console.error = function(...args) {
			error = args.find(arg => arg instanceof Error)
			if (error) {
				stackLines = error.stack.split(NL)
				functionLine = stackLines[1] or ""
				functionNameMatch = functionLine.match(/at (.+?) /)
				functionName = functionNameMatch ? functionNameMatch[1] : "unknown function"
				modifiedArgs = [`Error in function "${functionName}":`, ...args]
				originalConsoleError.apply(console, modifiedArgs)
			}
			else {
				originalConsoleError.apply(console, args)
			}
		}
		exampleFunction = function() {
			throw new Error("Something went wrong!")
		}
		try {
			exampleFunction()
		}
		catch (e) {
			console.error(e)
		}
	}
	create = function() {
		debug = {}
		draw = function(...args) {
			for message of args {
				element = document.createElement("label")
				element.textContent = message
				document.body.appendChild(element)
				space = document.createElement("label")
				space.textContent = " "
				document.body.appendChild(space)
			}
			document.body.appendChild(document.createElement("br"))
		}
		print = function(...args) {
			log(...args)
			if visual {
				draw(...args)
			}
		}
		assert = function(value, message) {
			if value isnt true {
				// trace(message)
			}
		}
		whine = function(...args) {
			// error(...args)
			// if visual {
			// 	draw(...args)
			// }
			// if authorical {
			// 	trace(...args)
			// }
			return new Error(...args)
		}
		/*
		point = function(px, py) {
			[cpx, cpy, cpz] = Camera.get_geometry()
			element = document.createElement("debug")
			element.style.left = 100*(0.5*innerWidth/innerHeight + (px - cpx)/cpz) + "vh"
			element.style.top = 100*(0.5 + (py - cpy)/cpz) + "vh"
			element.style.width = "0.5vh"
			element.style.height = "0.5vh"
			document.body.appendChild(element)
		}
		*/
		point = function(px, py) {
			element = document.createElement("debug")
			element.style.left = 100*px + "vh"
			element.style.top = 100*py + "vh"
			element.style.width = "0.5vh"
			element.style.height = "0.5vh"
			document.body.appendChild(element)
		}
		benchmark = function(name) {
			benchy = {}
			t0 = get_time()
			benchy.end = function() {
				t1 = get_time()
				print(name, t1 - t0)
			}
			return benchy
		}
		onerror = function(message, source, line, column, error_message) {
			// error("Terminating Error:", message)
			// trace(message)
			if authorical {
				draw(message)
			}
		}
		debug.assert = assert
		debug.benchmark = benchmark
		debug.draw = draw
		debug.point = point
		debug.print = print
		debug.trace = trace
		debug.whine = whine
		return debug
	}
	Debug.create = create
}