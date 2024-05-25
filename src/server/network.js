const Network = {}
{
	const parse = JSON.parse
	const stringify = JSON.stringify
	Network.link = (env) => {
		const Hooker = env.require('Hooker')
		const Signal = env.require('Signal')
		Network.create = (address, port) => {
			const network = {}
			const peers = {}
			const hooker = Hooker.create()
			const close = Signal.create()
			const connect = Signal.create()
			const error = Signal.create()
			network.receive = hooker.get
			const Peer = {}
			Peer.create = (socket) => {
				const peer = {}
				peer.send = (...values) => {
					socket.send(stringify(values))
				}
				peers[socket] = peer
				return peer
			}
			const host = Bun.serve({
				hostname: address,
				port: port,
				cert: `_include(cert.pem)`,
				key: `_include(key.pem)`,
				fetch(request, host) {
					if (host.upgrade(request)) {
						return
					}
					return new Response(`<!doctype html><body><script>"use strict"\n_include(../../build/index.html)</script>`, {headers: {'content-type': 'text/html'}})
				},
				websocket: {
					message(socket, data) {
						const values = parse(data)
						values.splice(1, 0, peers[socket])
						hooker.call(...values)
					},
					open(socket) {
						const peer = Peer.create(socket)
						connect.call(peer)
					},
					close(socket, code, data) {
						peers[socket] = undefined
					},
					drain(socket) {
					}
				},
			})
			network.send = (...values) => {
				for (const socket in peers) {
					peers[socket].send(...values)
				}
			}
			network.close = () => {
				host.stop()
			}
			const bounces = {}
			network.bounce = (key, callback) => {
				bounces[key] = callback
			}
			network.fetch = (peer, ...values) => {
				const unique = env.random()
				peer.send('fetch', unique, ...values)
				return receive(unique)
			}
			network.receive('fetch').tie((peer, unique, key, ...values) => {
				if (!bounces[key]) {
					env.error('no bounce', key)
					return
				}
				peer.send(unique, bounces[key](peer, ...values))
			})
			return network
		}
	}
}
