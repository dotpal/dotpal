const Store = {}
{
	const parse = JSON.parse
	const random = Math.random
	const stringify = JSON.stringify
	Store.load = (env) => {
		Store.create = () => {
			const store = {}
			const hooker = Hooker.create()
			const receive = hooker.get
			const set = State.create()
			const fetch = (id) => {
				const asset = localStorage[id]
				if (asset) {
					receive.call(id, parse(asset))
				}
				else {
					env.network.send('get_asset', id)
				}
			}
			store.get = (id) => {
				const bytes = localStorage[id]
				if (bytes) {
					return parse(bytes)
				}
			}
			store.set = (id, value) => {
				localStorage[id] = stringify(value)
			}
			store.fetch = (id) => {
				env.network.send('get_asset', id)
				return env.network.receive(id)
			}
			set.tie((id, asset) => {
				localStorage[id] = stringify(asset)
				receive.call(id, asset)
			})
			// env.network.receive('asset').tie((socket, id, asset) => {
			// 	set.set(id, asset)
			// })
			return store
		}
	}
}