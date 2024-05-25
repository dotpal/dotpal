const Store = {}
{
	const parse = JSON.parse
	const random = Math.random
	const stringify = JSON.stringify
	Store.link = (env) => {
		const Hooker = env.require('Hooker')
		const State = env.require('State')
		Store.create = () => {
			const store = {}
			const hooker = Hooker.create()
			const server = env.server
			const receive = hooker.get
			const set = State.create()
			const fetch = (id) => {
				const asset = localStorage[id]
				if (asset) {
					receive.call(id, parse(asset))
				}
				else {
					server.send('get_asset', id)
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
				server.send('get_asset', id)
				return network.receive(id)
			}
			set.tie((id, asset) => {
				localStorage[id] = stringify(asset)
				receive.call(id, asset)
			})
			return store
		}
	}
}