const Dotpal = {}
{
	const network = Network.create('192.168.1.165', 2024, 8000)
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
		network.receive('post').tie(([peer, options]) => {
			const refined = {}
			refined.description = options.description
			refined.id = random()
			refined.position = options.position
			refined.time = get_time()
			refined.title = options.title
			refined.type = 'post'
			database.push(refined)
			network.send(['post', refined])
		})
		network.receive('get_posts').tie(([peer, position]) => {
			for (const i in database_state) {
				const entry = database_state[i]
				if (entry.type === 'post' && get_square_distance(position, entry.position) < 0.01) {
					const options = entry
					network.share(peer, ['post', options])
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
					Debug.log('found user logging in')
					network.share(peer, ['login', user])
					return
				}
			}
			Debug.log('new user')
			user.bio = 'Hello world!'
			user.icon_url = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			user.secret = secret
			database.push(user)
			network.share(peer, ['login', user])
		})
	}
	network.listen()
}
//const dotpal = Dotpal.create()
//dotpal.run()