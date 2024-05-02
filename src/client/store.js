const Store = {}
{
	const parse = JSON.parse
	const random = Math.random
	const stringify = JSON.stringify
	Store.create = (network) => {
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
				network.send('get_asset', id)
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
			network.send('get_asset', id)
			return network.receive(id)
		}
		set.tie((id, asset) => {
			localStorage[id] = stringify(asset)
			receive.call(id, asset)
		})
		// network.receive('asset').tie((socket, id, asset) => {
		// 	set.set(id, asset)
		// })
		return store
	}
}