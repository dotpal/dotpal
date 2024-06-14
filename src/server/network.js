const Network = {}
{
	Network.link = (env) => {
		const Hooker = env.require("Hooker")
		const Serial = env.require("Serial")
		const Signal = env.require("Signal")
		Network.create = (address, port) => {
			const network = {}
			const sockets = []
			const hooker = Hooker.create()
			const connect = Signal.create()
			const receive = hooker.get
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
						const args = Serial.decode(data)
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
				socket.send(Serial.encode(args))
			}
			network.send = (...args) => {
				for (const i in sockets) {
					const socket = sockets[i]
					send_to(socket, ...args)
				}
			}
			network.send_but = (ignore, ...args) => {
				for (const i in sockets) {
					const socket = sockets[i]
					if (socket != ignore) {
						send_to(socket, ...args)
					}
				}
			}
			network.close = () => {
				host.stop()
			}
			network.fetch = (socket, ...args) => {
				const unique = env.get_random()
				send_to(socket, "fetch", unique, ...args)
				return receive(unique)
			}
			const bounces = {}
			network.bounce = (key, callback) => {
				bounces[key] = callback
			}
			receive("fetch").tie((socket, unique, key, ...args) => {
				if (!bounces[key]) {
					env.error("no bounce", key)
					return
				}
				send_to(socket, unique, bounces[key](socket, ...args))
			})
			network.send_to = send_to
			network.receive = receive
			network.bounce("connections", () => {
				return connections
			})
			return network
		}
	}
}
