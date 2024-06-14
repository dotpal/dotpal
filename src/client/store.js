const Store = {}
{
	Store.link = (env) => {
		const Serial = env.require("Serial")
		Store.create = (...args) => {
			const store = {}
			let state
			const reset = () => {
				set_state({})
			}
			const tick_state = () => {
				const regex = /state=([^;]+)/
				const match = regex.exec(document.cookie)
				if (match) {
					state = Serial.decode(atob(match[1]))
					console.log("parsed state", state)
				} else {
					console.log("couldnt parse cookie")
					reset()
				}
			}
			const set_state = (state1) => {
				state = state1
				document.cookie = "state=" + btoa(Serial.encode(state)) + ";"
			}
			const set = (id, value) => {
				state[id] = value
				set_state(state)
			}
			const get = (id) => {
				return state[id]
			}
			// const hooker = Hooker.create()
			// const receive = hooker.get
			// const set = State.create()
			// const fetch = (id) => {
			// 	const asset = localStorage[id]
			// 	if (asset) {
			// 		receive.call(id, Serial.decode(asset))
			// 	}
			// 	else {
			// 		env.network.send("asset", id)
			// 	}
			// }
			// get = (id) => {
			// 	const data = localStorage[id]
			// 	if (data) {
			// 		return Serial.decode(data)
			// 	}
			// }
			// set = (id, value) => {
			// 	localStorage[id] = Serial.encode(value)
			// }
			// fetch = (id) => {
			// 	env.network.send("asset", id)
			// 	return network.receive(id)
			// }
			// set.tie((id, asset) => {
			// 	localStorage[id] = Serial.encode(asset)
			// 	receive.call(id, asset)
			// })
			store.get = get
			store.reset = reset
			store.set = set
			tick_state()
			return store
		}
	}
}