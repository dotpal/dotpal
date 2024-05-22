const Store = {}
{
	const fs = require('fs')
	const parse = JSON.parse
	const stringify = JSON.stringify
	Store.link = (env) => {
		Store.create = (path, network) => {
			const store = {}
			if (!fs.existsSync(path)) {
				env.print('save file', path, 'doesnt exist creating it')
				fs.writeFileSync(path, '{}')
			}
			const assets = parse(fs.readFileSync(path))
			store.assets = assets
			store.save = () => {
				fs.writeFileSync(path, stringify(assets))
			}
			store.create = (type, id) => {
				const object = {}
				object.time = env.get_time()
				object.type = type
				if (!id) {
					id = env.random()
				}
				object.id = id
				assets[id] = object
				return object
			}
			store.get = (id) => {
				return assets[id]
			}
			network.receive('get_asset').tie((socket, id) => {
				network.share(socket, id, assets[id])
			})
			store.source = (asset, attributes) => {
				const clone = {...asset}
				for (const j in attributes) {
					const i = attributes[j]
					const id = asset[i]
					clone[i] = {...assets[id]}
				}
				return clone
			}
			return store
		}
	}
}