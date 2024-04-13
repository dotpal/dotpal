const PostViewer = {}
{
	const fs = require('fs')
	const path = require('path')
	const get_square_distance = (a, b) => {
		const [ax, ay] = a
		const [bx, by] = b
		const dx = bx - ax
		const dy = by - ay
		return dx*dx + dy*dy
	}
	PostViewer.create = (options) => {
		const database = options.database || Debug.log('oof no database')
		const network = options.network || Debug.log('oof no network')
		const database_state = database.get_state()
		network.receive('post').subscribe(([peer, options]) => {
			const refined = {}
			refined.description = options.description
			refined.id = Math.random()
			refined.position = options.position
			refined.time = new Date().getTime()
			refined.title = options.title
			refined.type = 'post'
			database.push(refined)
			network.send(['post', refined])
		})
		network.receive('get_posts').subscribe(([peer, position]) => {
			for (const i in database_state) {
				const entry = database_state[i]
				if (entry.type === 'post' && get_square_distance(position, entry.position) < 0.01) {
					const options = entry
					network.share(peer, ['post', options])
				}
			}
		})
	}
}