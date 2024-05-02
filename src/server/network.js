const Network = {}
{
	const fs = require('fs')
	const parse = JSON.parse
	const stringify = JSON.stringify
	Network.create = (host, port) => {
		const network = {}
		const sockets = []
		const hooker = Hooker.create()
		network.close = Signal.create()
		network.connect = Signal.create()
		network.error = Signal.create()
		network.receive = hooker.get
		const front = Bun.serve({
			hostname: host,
			port: port,
			fetch(request, front) {
				return new Response(fs.readFileSync('build/index.html'), {headers: {'content-type': 'text/html'}})
			}
		})
		const speed = Bun.serve({
			hostname: host,
			port: port + 1,
			fetch(request, speed) {
				speed.upgrade(request)
			},
			websocket: {
				message(socket, data) {
					const values = parse(data)
					values.splice(1, 0, socket)
					hooker.call(...values)
				},
				open(socket) {
					network.connect.call(socket)
					sockets.push(socket)
				},
				close(socket, code, data) {
					sockets.splice(sockets.indexOf(socket), 1)
				},
				drain(socket) {
				}
			}
		})
		network.send = (...values) => {
			for (const i in sockets) {
				sockets[i].send(stringify(values))
			}
		}
		network.send_but = (ignore_socket, ...values) => {
			for (const i in sockets) {
				const socket = sockets[i]
				if (socket != ignore_socket) {
					socket.send(stringify(values))
				}
			}
		}
		network.share = (socket, ...values) => {
			socket.send(stringify(values))
		}
		network.close = () => {
			front.stop()
			speed.stop()
		}
		return network
	}
}