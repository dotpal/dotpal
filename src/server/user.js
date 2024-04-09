const UserManager = {}
{
	const fs = require('fs')
	UserManager.create = function(options) {
		const database = options.database || Debug.log('oof no database')
		const database_state = database.get_state()
		const network = options.network || Debug.log('oof no network')
		network.receive('user').subscribe(function([peer, secret, user]) {
			user = user || {}
			for (const i in database_state) {
				const info = database_state[i]
				if (info.secret === secret) {
					Debug.log('found user, logging in')
					network.share(peer, ['login', user])
					return
				}
			}
			Debug.log('new user')
			user.secret = secret
			user.bio = 'Hello world!'
			user.icon_url = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			database.push(user)
			network.share(peer, ['login', user])
		})
	}
}