const Env = {}
{
	const env = {}
	const loaded = {}
	const steppers = []
	let t = 0.001*new Date().getTime()
	const require = (name) => {
		const _name = "_" + name
		if (!loaded[_name]) {
			eval("loaded." + _name + " = " + _name)
			if (loaded[_name].link) {
				console.log("linking", _name)
				// env != env so this isnt really right
				loaded[_name].link(env)
			}
		}
		return loaded[_name]
	}
	const push_stepper = (step) => {
		steppers.push(step)
	}
	const get_time = () => {
		return t
	}
	const loop = () => {
		const t0 = t
		t = 0.001*new Date().getTime()
		const dt = t - t0
		for (const stepper of steppers) {
			stepper(dt)
		}
		requestAnimationFrame(loop)
	}
	const create_button = (text, click) => {
		const button = document.createElement("button")
		button.onclick = click
		button.textContent = text
		document.body.appendChild(button)
		return button
	}
	const viewer = {}
	{
		const open = (blub) => {
			if (blub) {
				blub.view()
			}
			else {
				Viewer.create()
			}
		}
		viewer.open = open
	}
	const loading = {}
	{
		const create = () => {
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
		loading.create = create
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
			// document.addEventListener(name, () => {
			// 	event.preventDefault()
			// 	event.stopPropagation()
			// })
		})
	}
	env.create_button = create_button
	env.get_time = get_time
	env.get_time = get_time
	env.loading = loading
	env.require = require
	env.viewer = viewer
	const Blubs = require("Blubs")
	const Bubbles = require("Bubbles")
	const Camera = require("Camera")
	const Chain = require("Chain")
	const Debug = require("Debug")
	const Geo = require("Geo")
	const Hash = require("Hash")
	const Login = require("Login")
	const Netizens = require("Netizens")
	const Network = require("Network")
	const Random = require("Random")
	const Serializer = require("Serializer")
	const State = require("State")
	const Store = require("Store")
	const Users = require("Users")
	const Viewer = require("Viewer")
	const debug = Debug.create()
	env.assert = debug.assert
	env.draw = debug.draw
	env.error = debug.bug
	env.print = debug.print
	env.trace = debug.trace
	const serializer = Serializer.create()
	env.serializer = serializer
	const store = Store.create()
	env.store = store
	const random = Random.create()
	env.get_random = random.get
	const network = Network.create("localhost", 13371)
	env.network = network
	const geo = Geo.create()
	const get_position = () => {
		return geo.position.get()
	}
	env.get_position = get_position
	const camera = Camera.create()
	env.camera = camera
	const bubbles = Bubbles.create()
	env.bubbles = bubbles
	network.connect.tie((server) => {
		env.server = server
		const users = Users.create()
		env.users = users
		const blubs = Blubs.create()
		env.blubs = blubs
		const netizens = Netizens.create()
		env.netizens = netizens
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
						secret.set(token)
					})
				})
			}
			else {
				const user = users.create({id: token})
				users.fetch(user).tie((user) => {
					env.user = user
					env.create_button("create", () => {
						viewer.open()
					})
					env.create_button("profile", () => {
						env.print(user)
						user.view()
					})
				})
				const logout = document.createElement("button")
				logout.textContent = "logout"
				logout.onclick = () => {
					store.reset()
				}
				document.body.appendChild(logout)
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
	})
	// idk how i feel about this yet, maybe stepper should be inserted into the singletons
	// update: i think everything will just be externally controlled from dotpal which probably makes sense because dotpal describes the behavior of dotpal
	// we just need to make sure we expose well-defined functionality for each object
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
	const style = document.createElement("style")
	style.textContent = `_include(style.css)`
	document.head.appendChild(style)
	document.body.style.backgroundColor = "#e6e6e6"
	document.body.style.backgroundImage = "url(_include(globe.png))"
	// document.body.style.backgroundPosition = "center center"
	document.body.style.backgroundSize = "200vh"
	geo.position.set([0.970713, 5.45788891708])
	bubbles.click.tie((bubble) => {
		bubble.view()
	// 	focus(bubble.blub)
	// 	chain.push(bubble.blub)
	})
	geo.request()
	push_stepper(camera.step)
	push_stepper(bubbles.step)
	loop()
}