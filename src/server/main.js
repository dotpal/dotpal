const Main = {}
{
	const env = {}
	{
		const loaded = {}
		env.require = (name) => {
			const _name = '_' + name
			if (!loaded[_name]) {
				eval('loaded.' + _name + ' = ' + _name)
				loaded[_name].link(env)
			}
			return loaded[_name]
		}
	}
	const Clock = env.require('Clock')
	const Debug = env.require('Debug')
	const Hooker = env.require('Hooker')
	const Network = env.require('Network')
	const Random = env.require('Random')
	const Signal = env.require('Signal')
	const Store = env.require('Store')
	const debug = Debug.create()
	env.print = debug.print
	env.error = debug.error
	const random = Random.create()
	env.get_time = Clock.get_time
	env.random = random.get
	const network = Network.create('172.233.81.226', 443)
	const store = Store.create('store.json', network)
	{
		const get_square_distance = (a, b) => {
			const [ax, ay] = a
			const [bx, by] = b
			const dx = bx - ax
			const dy = by - ay
			return dx*dx + dy*dy
		}
		network.receive('blub').tie((peer, secret, options, parent) => {
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
		network.receive('get_blubs_by_position').tie((peer, position) => {
			for (const id in store.assets) {
				const asset = store.get(id)
				if (asset.type == 'blub' && asset.parent == undefined && get_square_distance(position, asset.position) < 0.001) {
					peer.send('blub', store.source(asset, ['user']))
				}
			}
		})
		network.receive('get_blub_children').tie((peer, parent) => {
			const children = store.get(parent).children
			for (const i in children) {
				const child = children[i]
				const asset = store.get(child)
				peer.send('blub', store.source(asset, ['user']))
			}
		})
	}
	{
		network.receive('user').tie((peer, secret, options) => {
			options = options || {}
			if (store.get(secret)) {
				const asset = store.get(secret)
				asset.bio = options.bio
				asset.email = options.email
				asset.icon = options.icon
				asset.name = options.name
				peer.send('user', asset)
				return
			}
			const asset = store.create('user', secret)
			asset.bio = 'Hello world!'
			asset.email = options.email
			asset.icon = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			asset.name = 'Noobie'
			peer.send('user', asset)
		})
	}
	// idk if this should be done externally or not but whatever
	process.on('SIGTERM', () => {
		store.save()
		network.close()
	})
}
