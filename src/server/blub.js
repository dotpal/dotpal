const Blub = {}
{
	const fs = require('fs')
	const path = require('path')
	const current = State.get_current()
	Network.receive('blub').subscribe(function([peer, options]) {
		const blub = {}
		blub.type = 'blub'
		blub.id = Math.random()
		blub.options = options
		State.push(blub)
		Network.send_but(peer, ['blub', options])
	})
	Network.connect.subscribe(function([peer]) {
		for (const i in current) {
			const entry = current[i]
			if (entry.type === 'blub') {
				const blub = entry
				Network.share(peer, ['blub', blub.options])
			}
		}
	})
}