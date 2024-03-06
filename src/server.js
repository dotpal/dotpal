'use strict'
INCLUDE(which.js)
INCLUDE(signal.js)
INCLUDE(network.js)
INCLUDE(peer.js)
{
	const the_network = network.create()
	the_network.receive('fetch').connect(function([peer, path]) {
		network.send(['fetch', readFileSync(path).toString()])
	})
	// we should really do secret instead
	the_network.receive('login').connect(function([peer, secret]) {
		console.log(secret)
		writeFileSync('store/' + secret, 'wtf man')
		peer.send(['asd', 'lmfao'])
	})
}