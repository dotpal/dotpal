const BlubManager = {}
{
	const fs = require('fs')
	const path = require('path')
	BlubManager.create = function(options) {
		const database = options.database || Debug.log('oof no database')
		const network = options.network || Debug.log('oof no network')
		const database_state = database.get_state()
		network.receive('blub').subscribe(function([peer, options]) {
			const blub = {}
			blub.type = 'blub'
			blub.id = Math.random()
			blub.options = options
			database.push(blub)
			network.send_but(peer, ['blub', options])
		})
		network.connect.subscribe(function([peer]) {
			for (const i in database_state) {
				const entry = database_state[i]
				if (entry.type === 'blub') {
					const blub = entry
					network.share(peer, ['blub', blub.options])
				}
			}
		})
	}
}