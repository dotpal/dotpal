const Store = {}
{
	const link = (env) => {
		const create = () => {
			const store = {}
			let state = {}
			const _tick_state = () => {
				const regex = /state=([^;]+)/
				const match = regex.exec(document.cookie)
				if (match) {
					state = env.serializer.decode(atob(match[1]))
					console.log("parsed state", state)
				} else {
					console.log("couldnt parse cookie")
					reset()
				}
			}
			const _set_state = (state1) => {
				state = state1
				document.cookie = "state=" + btoa(env.serializer.encode(state)) + ";"
			}
			const create = (id) => {
				state[id] = {}
				return state[id]
			}
			const get = (id) => {
				return state[id]
			}
			const reach = (id) => {
				if (id == undefined) {
					env.trace("store get missing an id")
				}
				if (!state[id]) {
					env.print("create new asset", id)
					state[id] = {}
				}
				return state[id]
			}
			const reset = () => {
				_set_state({})
			}
			const set = (id, value) => {
				state[id] = value
				_set_state(state)
			}
			// const hooker = Hooker.create()
			// const receive = hooker.get
			// const set = State.create()
			// const fetch = (id) => {
			// 	const asset = localStorage[id]
			// 	if (asset) {
			// 		receive.call(id, env.serializer.decode(asset))
			// 	}
			// 	else {
			// 		env.network.send("asset", id)
			// 	}
			// }
			// get = (id) => {
			// 	const data = localStorage[id]
			// 	if (data) {
			// 		return env.serializer.decode(data)
			// 	}
			// }
			// set = (id, value) => {
			// 	localStorage[id] = env.serializer.encode(value)
			// }
			// fetch = (id) => {
			// 	env.network.send("asset", id)
			// 	return network.receive(id)
			// }
			// set.tie((id, asset) => {
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