Store = {}
{
	fs = require("fs")
	link = function(env) {
		create = function(path) {
			store = {}
			if not fs.existsSync(path) {
				env.print("save file", path, "doesnt exist creating it")
				fs.writeFileSync(path, "{}")
			}
			state = env.serializer.decode(fs.readFileSync(path))
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
			save = function() {
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