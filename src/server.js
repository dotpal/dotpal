'use strict'
_include(which.js)
_include(signal.js)
_include(debug.js)
_include(network.js)
{
	const fs = require('fs')
	network.receive('fetch').connect(function([peer, path]) {
		network.send(['fetch', fs.readFileSync(path).toString()])
	})
	// we should really do secret instead
	network.receive('login').connect(function([peer, secret]) {
		debug.log('received login', secret)
		fs.writeFileSync('store/' + secret, 'wtf man')
		peer.send(['asd', 'lmfao'])
	})
}