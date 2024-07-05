const Network = {}
{
	const link = (env) => {
		const Hooker = env.require("Hooker")
		const Signal = env.require("Signal")
		const create = (address, port) => {
			const network = {}
			const bounces = {}
			const connect = Signal.create()
			const hooker = Hooker.create()
			const receive = hooker.get
			const sockets = []
			let connections = 0
			const host = Bun.serve({
				hostname: address,
				port: port,
				cert: `_include(cert.pem)`,
				key: `_include(key.pem)`,
				fetch(request, host) {
					if (host.upgrade(request)) {
						return
					}
					return new Response('<!doctype html><meta name=viewport content=initial-scale=1><link rel=icon href=_include(../client/bubble.png)><link rel=apple-touch-icon href=_include(../client/bubble.png)><body><script>"use strict"\n_include(../../build/index.html)</script>', {headers: {"content-type": "text/html"}})
				},
				websocket: {
					message(socket, data) {
						const args = env.serializer.decode(data)
						args.splice(1, 0, socket)
						hooker.call(...args)
					},
					open(socket) {
						sockets[connections] = socket
						++connections
						connect.call(socket)
					},
					close(socket, code, data) {
						sockets[sockets.indexOf(socket)] = sockets[connections - 1]
						--connections
					},
					drain(socket) {
						env.print("gonna drain a socket but idk what that means")
					}
				},
			})
			const send_to = (socket, ...args) => {
				const data = env.serializer.encode(args)
				socket.send(data)
			}
			const send = (...args) => {
				const data = env.serializer.encode(args)
				for (const i in sockets) {
					const socket = sockets[i]
					socket.send(data)
				}
			}
			const send_but = (ignore, ...args) => {
				const data = env.serializer.encode(args)
				for (const i in sockets) {
					const socket = sockets[i]
					if (socket != ignore) {
						socket.send(data)
					}
				}
			}
			const close = () => {
				host.stop()
			}
			const fetch = (socket, ...args) => {
				const unique = env.get_random()
				send_to(socket, "fetch", unique, ...args)
				return receive(unique)
			}
			const bounce = (key, callback) => {
				bounces[key] = callback
			}
			receive("fetch").tie((socket, unique, key, ...args) => {
				if (!bounces[key]) {
					env.error("no bounce", key)
					return
				}
				send_to(socket, unique, bounces[key](socket, ...args))
			})
			bounce("connections", () => {
				return connections
			})
			network.bounce = bounce
			network.close = close
			network.fetch = fetch
			network.receive = receive
			network.send = send
			network.send_but = send_but
			network.send_to = send_to
			return network
		}
		Network.create = create
	}
	Network.link = link
}