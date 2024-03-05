// Node.bs by Jeff Skinner
import {createServer} from 'http' // More like, express
import {readFileSync, readFile, writeFileSync} from 'fs'
let PORT = 8080
/*
let options = {
	key: fs.readFileSync('ssl/private.key.pem'),
	cert: fs.readFileSync('ssl/domain.cert.pem'),
	ca: fs.readFileSync('ssl/intermediate.cert.pem'),
}
*/
let types = {
	html: 'text/html',
	ico: 'image/x-icon',
	jpg: 'image/jpeg',
	png: 'image/png',
	gif: 'image/gif',
	css: 'text/css',
	js: 'text/javascript',
	wasm: 'application/wasm',
	otf: 'font/otf',
}
function getRequestOrigin(request) {
	return request.headers['x-forwarded-for'] || request.connection.remoteAddress // Still don't get this
}
function getRequestDestinationMIME(request) {
	return (
		types[request.url.substr(request.url.lastIndexOf('.') + 1)] || 'text/plain' // Don't like anything after ||
	)
}
// readFileAsync?
function getRequestFileData(URL) {
	readFile('.' + URL, (error, data) => {
		if (error) return null
		else return data
	})
}
function parseURL(url) {
	return url + (url === '/' && 'index.html' || '')
}
createServer((request, response) => {
		let origin = getRequestOrigin(request)
		console.log(request.url)
		//console.log(origin)
		/*
		fs.appendFile('dynamic/history', origin + '\n', (error) => {
			if (error) console.log('Write error')
		})
		*/
		readFile('.' + request.url, (error, data) => {
			if (error)
				readFile('.' + request.url, (error, data) => {
					if (error) response.end(origin + ", you don't belong here...")
					else {
						response.setHeader(
							'Content-Type',
							getRequestDestinationMIME(request)
						)
						response.end(data)
					}
				})
			else {
				// console.log(getRequestDestinationMIME(request))
				response.setHeader('Content-Type', getRequestDestinationMIME(request))
				response.end(data)
			}
		})
	})
	.listen(PORT)
function newSignal() {
	let signal = {}
	let events = []
	signal.connect = func => {
		events.push(func)
		return () =>
			events.splice(events.indexOf(func), 1)
	}
	signal.fire = args => {
		for (let i in events)
			events[i](args)
	}
	return signal
}
import {WebSocketServer} from 'ws'
function initClientDistributor(port) {
	return createServer(
		(request, response) => {
			if (request.url == '/')
				request.url += 'index.html'
			request.url = '/Lucky-Kart' + request.url
			console.log(request.url)
			try {
				response.setHeader('Access-Control-Allow-Origin', '*')
				response.setHeader('Content-Type', MIMEs[request.url.split('.').pop()])
				response.end(readFileSync(request.url.substr(1)))
			}
			catch (error) {
				console.log(error)
			}
		}
	).listen(port)
}
let peer = {}
{
	peer.create = function(socket) {
		let self = {}
		self.send = function(params) {
			socket.send(JSON.stringify(params))
		}
		return self
	}
}
function newNetwork(server) {
	let network = {}
	network.open = newSignal()
	network.close = newSignal()
	network.error = newSignal()
	let ss = new WebSocketServer({server})
	let sockets = []
	network.send = params => {
		for (let id in sockets)
			if (sockets[id])
				sockets[id].send(JSON.stringify(params))
	}
	let listeners = {}
	network.receive = key => {
		if (listeners[key])
			return listeners[key]
		return listeners[key] = newSignal()
	}
	let index = 0
	ss.on('connection', socket => {
		let id = ++index
		let peer_ = peer.create(socket)
		sockets[id] = peer_
		//sockets[id] = peer.create(socket)
		socket.on('close', () =>
			sockets[id] = null
		)
		socket.on('message', message => {
			let [key, ...args] = JSON.parse(message.toString())
			if (listeners[key]) {
				args.unshift(peer_)
				listeners[key].fire(args)
			}
			else
				console.log('no key: ' + key)
		})
	})
	return network
}
let server = initClientDistributor(3565)
let network = newNetwork(server)
network.receive('fetch').connect(([peer, path]) =>
	network.send(['fetch', readFileSync(path).toString()])
)
// We should really do secret instead
network.receive('login').connect(function([peer, secret]) {
	console.log(secret)
	writeFileSync('store/' + secret, 'wtf man')
	peer.send(['asd', 'lmfao'])
})
console.log('Hosted on port: ' + PORT)