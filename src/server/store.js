const Store = {}
{
	const fs = require("fs")
	const link = (env) => {
		const create = (path) => {
			const store = {}
			if (!fs.existsSync(path)) {
				env.print("save file", path, "doesnt exist creating it")
				fs.writeFileSync(path, "{}")
			}
			const state = env.serializer.decode(fs.readFileSync(path))
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
			const save = () => {
				env.print("saving state")
				fs.writeFileSync(path, env.serializer.encode(state))
			}
			store.create = create
			store.get = get
			store.reach = reach
			store.save = save
			store.state = state
			return store
		}
		Store.create = create
	}
	Store.link = link
}