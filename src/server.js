'use strict'
_include(which.js)
_include(signal.js)
_include(debug.js)
_include(network.js)
_include(post.js)
{
	const fs = require('fs')
	// we should really do secret instead
	network.receive('login').connect(function([peer, secret]) {
		debug.log('received login', secret)
		fs.writeFileSync('store/' + secret, 'wtf man')
	})
}