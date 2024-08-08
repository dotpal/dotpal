Store = {}
{
	link = function(env) {
		create = function() {
			store = {}
			soft state = {}
			_tick_state = function() {
				regex = /state=([^;]+)/
				match = regex.exec(document.cookie)
				if match {
					state = env.serializer.decode(atob(match[1]))
					console.log("parsed state", state)
				}
				else {
					console.log("couldnt parse cookie")
					reset()
				}
			}
			_set_state = function(state1) {
				state = state1
				document.cookie = "state=" + btoa(env.serializer.encode(state)) + ";"
			}
			create = function(id) {
				state[id] = {}
				return state[id]
			}
			get = function(id) {
				return state[id]
			}
			reach = function(id) {
				if id is nil {
					env.trace("store get missing an id")
				}
				if not state[id] {
					env.print("create new asset", id)
					state[id] = {}
				}
				return state[id]
			}
			reset = function() {
				_set_state({})
			}
			set = function(id, value) {
				state[id] = value
				_set_state(state)
			}
			// hooker = Hooker.create()
			// receive = hooker.get
			// set = State.create()
			// fetch = function(id) {
			// 	asset = localStorage[id]
			// 	if asset {
			// 		receive.call(id, env.serializer.decode(asset))
			// 	}
			// 	else {
			// 		env.network.send("asset", id)
			// 	}
			// }
			// get = function(id) {
			// 	data = localStorage[id]
			// 	if data {
			// 		return env.serializer.decode(data)
			// 	}
			// }
			// set = function(id, value) {
			// 	localStorage[id] = env.serializer.encode(value)
			// }
			// fetch = function(id) {
			// 	env.network.send("asset", id)
			// 	return network.receive(id)
			// }
			// set.tie(function(id, asset) {
			// 	localStorage[id] = env.serializer.encode(asset)
			// 	receive.call(id, asset)
			// })
			store.create = create
			store.get = get
			store.reach = reach
			store.reset = reset
			store.set = set
			_tick_state()
			return store
		}
		Store.create = create
	}
	Store.link = link
}