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
		network.receive('blub').tie(([peer, options]) => {
			const refined = {}
			refined.children = []
			refined.description = options.description
			refined.id = random()
			refined.depth = 0
			refined.position = options.position
			refined.time = get_time()
			refined.title = options.title
			refined.type = 'blub'
			database.push(refined)
			network.send(['blub', refined])
		})
		network.receive('get_blubs').tie(([peer, position]) => {
			for (const i in database_state) {
				const entry = database_state[i]
				if (entry.type === 'blub' && entry.depth === 0 && get_square_distance(position, entry.position) < 0.001) {
					const options = entry
					network.share(peer, ['blub', options])
				}
			}
		})
	}
	{
		const database_state = database.get_state()
		network.receive('user').tie(([peer, secret, user]) => {
			user = user || {}
			for (const i in database_state) {
				const info = database_state[i]
				if (info.secret === secret) {
					network.share(peer, ['login', user])
					return
				}
			}
			user.bio = 'Hello world!'
			user.icon = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			user.secret = secret
			user.time = get_time()
			database.push(user)
			network.share(peer, ['login', user])
		})
	}
	// idk if this should be done externally or not but whatever
	process.on('SIGTERM', () => {
		database.save()
		network.close()
	})
	network.listen()
}
//const dotpal = Dotpal.create()
//dotpal.run()