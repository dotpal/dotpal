Env = {}
{
	env = {}
	loaded = {}
	steppers = []
	soft t = 0.001*new Date().getTime()
	require = function(name) {
		_name = "_" + name
		if not loaded[_name] {
			eval("loaded." .. _name .. " = " .. _name)
			if loaded[_name].link {
				// env isnt env so this isnt really right
				loaded[_name].link(env)
			}
		}
		return loaded[_name]
	}
	push_stepper = function(step) {
		steppers.push(step)
	}
	get_time = function() {
		return t
	}
	loop = function() {
		t0 = t
		old t = 0.001*new Date().getTime()
		dt = t - t0
		for stepper of steppers {
			stepper(dt)
		}
		requestAnimationFrame(loop)
	}
	create_button = function(text, click) {
		button = document.createElement("button")
		button.onclick = click
		button.textContent = text
		document.body.appendChild(button)
		return button
	}
	viewer = {}
	{
		open = function(blub) {
			if blub {
				blub.view()
			}
			else {
				Viewer.create()
			}
		}
		viewer.open = open
	}
	loading = {}
	{
		create = function() {
			loading = {}
			sprite = document.createElement("loading")
			// sprite.style.backgroundImage = "./loading.gif"
			sprite.style.backgroundSize = "20vh"
			document.body.appendChild(sprite)
			loading.remove = function() {
				sprite.remove()
				loading.remove = nil
			}
			return loading
		}
		loading.create = create
	}
	events = [
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
	disable_events = function() {
		events.forEach(function(name) {
			document["on" .. name] = function() {
				event.preventDefault()
				event.stopPropagation()
			}
			// document.addEventListener(name, function() {
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
	Blubs = require("Blubs")
	Bubbles = require("Bubbles")
	Camera = require("Camera")
	Chain = require("Chain")
	Debug = require("Debug")
	Geo = require("Geo")
	Hash = require("Hash")
	Login = require("Login")
	Netizens = require("Netizens")
	Network = require("Network")
	Random = require("Random")
	Serializer = require("Serializer")
	State = require("State")
	Store = require("Store")
	Users = require("Users")
	Viewer = require("Viewer")
	debug = Debug.create()
	env.assert = debug.assert
	env.draw = debug.draw
	env.print = debug.print
	env.trace = debug.trace
	env.whine = debug.whine
	serializer = Serializer.create()
	env.serializer = serializer
	store = Store.create()
	env.store = store
	random = Random.create()
	env.get_random = random.get
	network = Network.create("localhost", 8000)
	env.network = network
	geo = Geo.create()
	get_position = function() {
		return geo.position.get()
	}
	env.get_position = get_position
	camera = Camera.create()
	env.camera = camera
	bubbles = Bubbles.create()
	env.bubbles = bubbles
	network.connect.tie(function(server) {
		env.server = server
		users = Users.create()
		env.users = users
		blubs = Blubs.create()
		env.blubs = blubs
		netizens = Netizens.create()
		env.netizens = netizens
		secret = State.create(
			function(token) {
				store.set("token", token)
			},
			function() {
				return store.get("token")
			}
		)
		// login = Signal.create()
		secret.change(function(token) {
			if not token {
				soft login = Login.create()
				login.submit.tie(function(email, password) {
					login.remove()
					Hash.digest(email + password).then(function(token) {
						users.create({
							email: email,
							id: token,
						})
						secret.set(token)
					})
				})
			}
			else {
				user = users.create({id: token})
				users.fetch(user).tie(function(user) {
					env.user = user
					env.create_button("create", function() {
						viewer.open()
					})
					env.create_button("profile", function() {
						env.print("print the user:", user)
						user.view()
					})
				})
				logout = document.createElement("button")
				logout.textContent = "logout"
				logout.onclick = function() {
					store.reset()
				}
				document.body.appendChild(logout)
			}
		})
		secret.check()
		// chain = Chain.create()
		soft focused = {}
		refresh = function(position) {
			bubbles.clear()
			blubs.fetch(position)
		}
		geo.position.change(refresh)
		blubs.receive.tie(function(blub) {
			bubbles.create(blub)
			camera.focus(bubbles.bubbles)
		})
	})
	// idk how i feel about this yet, maybe stepper should be inserted into the singletons
	// update: i think everything will just be externally controlled from dotpal which probably makes sense because dotpal describes the behavior of dotpal
	// we just need to make sure we expose well-defined functionality for each object
	// soft px0 = 0
	// soft py0 = 0
	// soft pz0 = 1
	// document.addEventListener("gesturestart", function() {
	// 	pz0 = event.scale
	// })
	// document.addEventListener("gestureend", function() {
	// 	px0 += event.clientX/innerHeight
	// 	py0 += event.clientY/innerHeight
	// 	pz0 /= event.scale
	// })
	// document.addEventListener("gesturechange", function() {
	// 	event.preventDefault()
	// 	px = px0 + event.clientX/innerHeight
	// 	py = py0 + event.clientY/innerHeight
	// 	pz = 1/event.scale
	// 	// document.body.style.transform = "translate(" + px + "vh, " + py + "vh) rotate(" + event.rotation + "deg)"
	// 	document.body.style.backgroundPosition = 100*px + "vh " + 100*py + "vh"
	// 	document.body.style.backgroundSize = 200/pz + "vh"
	// })
	style = document.createElement("style")
	style.textContent = "./style.css"
	document.head.appendChild(style)
	document.body.style.backgroundColor = "#e6e6e6"
	document.body.style.backgroundImage = "./globe.png"
	// document.body.style.backgroundPosition = "center center"
	document.body.style.backgroundSize = "200vh"
	geo.position.set([0.970713, 5.45788891708])
	bubbles.click.tie(function(bubble) {
		bubble.view()
	// 	focus(bubble.blub)
	// 	chain.push(bubble.blub)
	})
	geo.request()
	push_stepper(camera.step)
	push_stepper(bubbles.step)
	loop()
}
