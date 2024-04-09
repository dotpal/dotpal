const User = {}
{
	const fs = require('fs')
	Network.receive('edit').subscribe(function([peer, secret, options1]) {
		Debug.log('edit something')
		if (!options1) {
			options1 = {}
		}
		let options0 = undefined
		try {
			options0 = JSON.parse(fs.readFileSync('user/' + secret, 'utf8'))
		}
		catch {
			options0 = {}
			options0.bio = ''
			options0.icon_url = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			options0.username = String(Math.random())
		}
		// this is not good because its always writing
		options1.bio = options1.bio || options0.bio
		options1.email = options1.email || 'this person signed up without an email lmao'
		options1.icon_url = options1.icon_url || options0.icon_url
		options1.username = options1.username || options0.username
		const user = {}
		user.type = 'user'
		user.id = Math.random()
		user.options = options1
		Network.share(peer, ['login', options1])
	})
}