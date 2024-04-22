const Dotpal = {}
{
	const network = Network.create('localhost', 8000)
	const database = Saver.create('database.json')
	{
		const fs = require('fs')
		const path = require('path')
		const random = Math.random
		const get_square_distance = (a, b) => {
			const [ax, ay] = a
			const [bx, by] = b
			const dx = bx - ax
			const dy = by - ay
			return dx*dx + dy*dy
		}
		const database_state = database.get_state()
		network.receive('blub').tie(([peer, secret, options]) => {
			for (const id in database_state) {
				if (database_state[id].secret === secret) {
					const entry = database.create('blub')
					entry.children = []
					entry.description = options.description
					entry.position = options.position
					entry.title = options.title
					entry.user = id
					network.send(['blub', database.source(entry, ['user'])])
				}
			}
		})
		network.receive('get_blubs').tie(([peer, position]) => {
			for (const id in database_state) {
				const entry = database_state[id]
				if (entry.type === 'blub' && get_square_distance(position, entry.position) < 0.001) {
					network.share(peer, ['blub', entry])
				}
			}
		})
	}
	{
		const database_state = database.get_state()
		network.receive('user').tie(([peer, secret, options]) => {
			for (const id in database_state) {
				const entry = database_state[id]
				if (entry.secret === secret) {
					if (options) {
						entry.bio = options.bio
						entry.icon = options.icon
						entry.name = options.name
					}
					network.share(peer, ['login', entry])
					return
				}
			}
			const entry = database.create('user')
			entry.bio = 'Hello world!'
			entry.icon = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			entry.name = options.name
			entry.secret = secret
			network.share(peer, ['login', entry])
		})
	}
	// idk if this should be done externally or not but whatever
	process.on('SIGTERM', () => {
		database.save()
		network.close()
	})
	network.listen()
}
// const dotpal = Dotpal.create()
// dotpal.run()