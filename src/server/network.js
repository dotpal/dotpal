const Network = {}
{
	const fs = require('fs')
	const http = require('http')
	const ws = require('ws')
	const parse = JSON.parse
	const stringify = JSON.stringify
	Network.create = (host, port) => {
		const network = {}
		const sockets = []
		const listeners = Listeners.create()
		network.close = Signal.create()
		network.connect = Signal.create()
		network.error = Signal.create()
		network.receive = listeners.set
		const front = http.createServer((request, response) => {
			response.setHeader('content-type', 'text/html')
			response.end(fs.readFileSync('build/index.html'))
		})
		const speed = new ws.WebSocketServer({server: front})
		network.send = (values) => {
			for (const id in sockets) {
				if (sockets[id]) {
					sockets[id].send(stringify(values))
				}
			}
		}
		network.send_but = (ignore_socket, values) => {
			for (const id in sockets) {
				if (sockets[id] && sockets[id] != ignore_socket) {
					sockets[id].send(stringify(values))
				}
			}
		}
		network.share = (socket, values) => {
			socket.send(stringify(values))
		}
		let index = 0
		speed.on('connection', (socket) => {
			network.connect.call([socket])
			const id = ++index
			sockets[id] = socket
			socket.on('close', () => {
				sockets[id] = undefined
			})
			socket.on('message', (message) => {
				const [key, ...values] = parse(message.toString())
				values.unshift(socket)
				listeners.call(key, values)
			})
		})
		network.listen = () => {
			front.listen(port)
		}
		network.close = () => {
			front.close()
			speed.close()
		}
		return network
	}
}