const Dotpal = {}
{
	const network = Network.create('localhost', 8000)
	const store = Store.create('store.json', network)
	{
		const random = Math.random
		const get_square_distance = (a, b) => {
			const [ax, ay] = a
			const [bx, by] = b
			const dx = bx - ax
			const dy = by - ay
			return dx*dx + dy*dy
		}
		network.receive('blub').tie((socket, secret, options, parent) => {
			if (store.get(secret)) {
				const asset = store.create('blub')
				asset.children = []
				asset.description = options.description
				asset.position = options.position
				asset.title = options.title
				asset.user = secret
				if (parent) {
					asset.parent = parent
					store.get(parent).children.push(asset.id)
				}
				network.send('blub', store.source(asset, ['user']))
			}
		})
		network.receive('get_blubs_by_position').tie((socket, position) => {
			for (const id in store.assets) {
				const asset = store.get(id)
				if (asset.type == 'blub' && asset.parent == undefined && get_square_distance(position, asset.position) < 0.001) {
					network.share(socket, 'blub', store.source(asset, ['user']))
				}
			}
		})
		network.receive('get_blub_children').tie((socket, parent) => {
			const children = store.get(parent).children
			for (const i in children) {
				const child = children[i]
				const asset = store.get(child)
				network.share(socket, 'blub', store.source(asset, ['user']))
			}
		})
	}
	{
		network.receive('user').tie((socket, secret, options) => {
			options = options || {}
			if (store.get(secret)) {
				const asset = store.get(secret)
				asset.bio = options.bio
				asset.email = options.email
				asset.icon = options.icon
				asset.name = options.name
				network.share(socket, 'user', asset)
				return
			}
			const asset = store.create('user', secret)
			asset.bio = 'Hello world!'
			asset.email = options.email
			asset.icon = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			asset.name = 'Noobie'
			network.share(socket, 'user', asset)
		})
	}
	// idk if this should be done externally or not but whatever
	process.on('SIGTERM', () => {
		store.save()
		network.close()
	})
}
// const dotpal = Dotpal.create()
// dotpal.run()