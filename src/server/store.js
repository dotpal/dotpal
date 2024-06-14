const Store = {}
{
	const fs = require("fs")
	Store.link = (env) => {
		const Serial = env.require("Serial")
		Store.create = (path) => {
			const store = {}
			if (!fs.existsSync(path)) {
				env.print("save file", path, "doesnt exist creating it")
				fs.writeFileSync(path, "{}")
			}
			const assets = Serial.decode(fs.readFileSync(path))
			store.assets = assets
			store.save = () => {
				env.print("saving state")
				// we should print the writes or differences
				fs.writeFileSync(path, Serial.encode(assets))
			}
			store.add = (type, id) => {
				const object = {}
				object.time = env.get_time()
				object.type = type
				if (!id) {
					id = env.get_random()
				}
				object.id = id
				assets[id] = object
				return object
			}
			// network bounce could use store.get but it would be slower.
			// but if thats slower, then why dont we just get rid of all abstractions to make
			// things faster? because it would be hard to read because of poor semantics
			// so maybe poor semantics are alright in a local setting (for speed sake), but not across files
			store.get = (id) => {
				return assets[id]
			}
			env.network.bounce("asset", (socket, id) => {
				return assets[id]
			})
			store.source = (asset, attributes) => {
				const clone = {...asset}
				for (const i of attributes) {
					const id = asset[i]
					clone[i] = {...assets[id]}
				}
				return clone
			}
			return store
		}
	}
}