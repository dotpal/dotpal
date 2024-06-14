const Main = {}
{
	const env = {}
	env.create_button = (text, click) => {
		const button = document.createElement("button")
		button.onclick = click
		button.textContent = text
		document.body.appendChild(button)
		return button
	}
	const debug = {}
	{
		const error = console.error
		const log = console.log
		const trace = console.trace
		const authorical = true
		const visual = false
		onerror = (message, source, line, column, error) => {
			trace(message)
			if (authorical) {
				draw(message)
			}
		}
		const draw = (...args) => {
			if (typeof process == "undefined") {
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
		}
		const print = (...args) => {
			log(...args)
			if (visual) {
				draw(...args)
			}
		}
		debug.draw = draw
		debug.print = print
		debug.error = (...args) => {
			// if (visual) {
			// 	draw(...args)
			// }
			// if (authorical) {
			// 	trace(...args)
			// }
		}
		debug.trace = trace
		/*
		debug.point = (px, py) => {
			const [cpx, cpy, cpz] = Camera.get_geometry()
			const element = document.createElement("debug")
			element.style.left = 100*(0.5*innerWidth/innerHeight + (px - cpx)/cpz) + "vh"
			element.style.top = 100*(0.5 + (py - cpy)/cpz) + "vh"
			element.style.width = "0.5vh"
			element.style.height = "0.5vh"
			document.body.appendChild(element)
		}
		*/
		debug.point = (px, py) => {
			const element = document.createElement("debug")
			element.style.left = 100*px + "vh"
			element.style.top = 100*py + "vh"
			element.style.width = "0.5vh"
			element.style.height = "0.5vh"
			document.body.appendChild(element)
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
	}
	env.draw = debug.draw
	env.error = debug.error
	env.print = debug.print
	env.trace = debug.trace
	{
		const loaded = {}
		env.require = (name) => {
			const _name = "_" + name
			if (!loaded[_name]) {
				eval("loaded." + _name + " = " + _name)
				if (loaded[_name].link) {
					// env.print("load with env", name)
					loaded[_name].link(env)
				}
				else {
					// env.print("load independent", name)
				}
			}
			return loaded[_name]
		}
	}
	const events = [
		"abort",
		"animationend",
		"animationiteration",
		"animationstart",
		"beforeunload",
		"blur",
		"canplay",
		"canplaythrough",
		"change",
		"click",
		"contextmenu",
		"copy",
		"cut",
		"dblclick",
		"DOMAttrModified",
		"DOMCharacterDataModified",
		"DOMNodeInserted",
		"DOMNodeInsertedIntoDocument",
		"DOMNodeRemoved",
		"DOMNodeRemovedFromDocument",
		"DOMSubtreeModified",
		"drag",
		"dragend",
		"dragenter",
		"dragleave",
		"dragover",
		"dragstart",
		"drop",
		"durationchange",
		"emptied",
		"ended",
		"error",
		"focus",
		"focusin",
		"focusout",
		"gesturechange",
		"gestureend",
		"gesturestart",
		"gotpointercapture",
		"hashchange",
		"input",
		"keydown",
		"keypress",
		"keyup",
		"load",
		"loadeddata",
		"loadedmetadata",
		"loadstart",
		"lostpointercapture",
		"mousedown",
		"mouseenter",
		"mouseleave",
		"mousemove",
		"mouseout",
		"mouseover",
		"mouseup",
		"pagehide",
		"pageshow",
		"paste",
		"pause",
		"play",
		"playing",
		"pointercancel",
		"pointerdown",
		"pointerenter",
		"pointerleave",
		"pointermove",
		"pointerout",
		"pointerover",
		"pointerup",
		"progress",
		"ratechange",
		"reset",
		"resize",
		"scroll",
		"seeked",
		"seeking",
		"stalled",
		"submit",
		"suspend",
		"timeupdate",
		"toggle",
		"touchcancel",
		"touchend",
		"touchmove",
		"touchstart",
		"transitioncancel",
		"transitionend",
		"transitionrun",
		"transitionstart",
		"unload",
		"volumechange",
		"waiting",
		"wheel",
	]
	const disable_events = () => {
		events.forEach((name) => {
			document["on" + name] = () => {
				event.preventDefault()
				event.stopPropagation()
			}
			/*
			document.addEventListener(name, () => {
				event.preventDefault()
				event.stopPropagation()
			})
			*/
		})
	}
	// Capitalized things are pure
	// disable_events()
	// env is shared memory
	const Blubs = env.require("Blubs")
	const Bubbles = env.require("Bubbles")
	const Camera = env.require("Camera")
	const Chain = env.require("Chain")
	const Geo = env.require("Geo")
	const Hash = env.require("Hash")
	const Login = env.require("Login")
	const Network = env.require("Network")
	const Random = env.require("Random")
	const State = env.require("State")
	const Store = env.require("Store")
	const Users = env.require("Users")
	const Viewer = env.require("Viewer")
	const Netizens = env.require("Netizens")
	{
		const viewer = {}
		viewer.open = (blub) => {
			if (blub) {
				blub.view()
			}
			else {
				Viewer.create()
			}
		}
		env.viewer = viewer
	}
	const stepper = {}
	{
		const steppers = []
		let t = 0.001*new Date().getTime()
		stepper.add = (step) => {
			steppers.push(step)
		}
		env.get_time = () => {
			return t
		}
		const min = Math.min
		const update = () => {
			const t0 = t
			t = 0.001*new Date().getTime()
			const dt = t - t0
			for (const stepper of steppers) {
				stepper(dt)
			}
			requestAnimationFrame(update)
		}
		requestAnimationFrame(update)
	}
	const store = Store.create()
	env.store = store
	const random = Random.create()
	env.get_random = random.get
	const network = Network.create("emelr.com", 443)
	env.network = network
	network.connect.tie((server) => {
		const loading = {}
		{
			loading.create = () => {
				const loading = {}
				const sprite = document.createElement("loading")
				// sprite.style.backgroundImage = "url(_include(loading.gif))"
				sprite.style.backgroundSize = "20vh"
				document.body.appendChild(sprite)
				loading.remove = () => {
					sprite.remove()
					loading.remove = undefined
				}
				return loading
			}
		}
		env.loading = loading
		const logout = document.createElement("button")
		logout.textContent = "logout"
		logout.onclick = () => {
			store.reset()
		}
		document.body.appendChild(logout)
		env.server = server
		const camera = Camera.create()
		env.camera = camera
		const geo = Geo.create()
		env.geo = geo
		const users = Users.create()
		env.users = users
		const bubbles = Bubbles.create()
		env.bubbles = bubbles
		const blubs = Blubs.create()
		env.blubs = blubs
		const netizens = Netizens.create()
		env.netizens = netizens
		const style = document.createElement("style")
		style.textContent = `_include(style.css)`
		document.head.appendChild(style)
		const secret = State.create(
			(token) => {
				store.set("token", token)
			},
			() => {
				return store.get("token")
			}
		)
		// const login = Signal.create()
		secret.change((token) => {
			if (!token) {
				let login = Login.create()
				login.submit.tie((email, password) => {
					login.remove()
					Hash.digest(email + password).then((token) => {
						users.create({
							email: email,
							id: token,
						})
						// this needs to be after server.send... idk how i feel
						secret.set(token)
					})
				})
			}
			else {
				env.id = token
				users.fetch(token).tie((user) => {
					// this is really, really bad
					// env.print("get user", user)
					env.get_user = () => {
						return user
					}
					env.create_button("create", () => {
						env.viewer.open()
					})
					env.create_button("profile", () => {
						user.view()
					})
				})
			}
		})
		secret.check()
		// const chain = Chain.create()
		let focused = {}
		const refresh = (position) => {
			bubbles.clear()
			blubs.fetch(position)
		}
		geo.position.change(refresh)
		blubs.receive.tie((blub) => {
			bubbles.create(blub)
			camera.focus(bubbles.bubbles)
		})
		bubbles.click.tie((bubble) => {
			bubble.view()
		// 	focus(bubble.blub)
		// 	chain.push(bubble.blub)
		})
		// idk how i feel about this yet, maybe stepper should be inserted into the singletons
		// update: i think everything will just be externally controlled from dotpal which probably makes sense because dotpal describes the behavior of dotpal
		// we just need to make sure we expose well-defined functionality for each object
		stepper.add(camera.step)
		stepper.add(bubbles.step)
		geo.position.set([0.970713, 5.45788891708])
		geo.request()
		{
			document.body.style.backgroundColor = "#e6e6e6"
			document.body.style.backgroundImage = "url(_include(globe.png))"
			// document.body.style.backgroundPosition = "center center"
			document.body.style.backgroundSize = "200vh"
			// let px0 = 0
			// let py0 = 0
			// let pz0 = 1
			// document.addEventListener("gesturestart", () => {
			// 	pz0 = event.scale
			// })
			// document.addEventListener("gestureend", () => {
			// 	px0 += event.clientX/innerHeight
			// 	py0 += event.clientY/innerHeight
			// 	pz0 /= event.scale
			// })
			// document.addEventListener("gesturechange", () => {
			// 	event.preventDefault()
			// 	const px = px0 + event.clientX/innerHeight
			// 	const py = py0 + event.clientY/innerHeight
			// 	const pz = 1/event.scale
			// 	// document.body.style.transform = "translate(" + px + "vh, " + py + "vh) rotate(" + event.rotation + "deg)"
			// 	document.body.style.backgroundPosition = 100*px + "vh " + 100*py + "vh"
			// 	document.body.style.backgroundSize = 200/pz + "vh"
			// })
		}
	})
}