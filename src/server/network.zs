Network = {}
{
	link = function(env) {
		Hooker = env.require("Hooker")
		Signal = env.require("Signal")
		create = function(address, port) {
			network = {}
			bounces = {}
			connect = Signal.create()
			hooker = Hooker.create()
			receive = hooker.get
			sockets = []
			soft connections = 0
			host = Bun.serve({
				hostname: address,
				port: port,
				cert: `./cert.pem`,
				key: `./key.pem`,
				fetch(request, host) {
					if host.upgrade(request) {
						return
					}
					return new Response('<!doctype html><meta name=viewport content=initial-scale=1><link rel=icon href=./../client/bubble.png><link rel=apple-touch-icon href=./../client/bubble.png><body><script>"use strict"\n./../../build/index.html</script>', {headers: {"content-type": "text/html"}})
				},
				websocket: {
					message(socket, data) {
						args = env.serializer.decode(data)
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
			send_to = function(socket, ...args) {
				data = env.serializer.encode(args)
				socket.send(data)
			}
			send = function(...args) {
				data = env.serializer.encode(args)
				for i in sockets {
					socket = sockets[i]
					socket.send(data)
				}
			}
			send_but = function(ignore, ...args) {
				data = env.serializer.encode(args)
				for i in sockets {
					socket = sockets[i]
					if socket isnt ignore {
						socket.send(data)
					}
				}
			}
			close = function() {
				host.stop()
			}
			fetch = function(socket, ...args) {
				unique = env.get_random()
				send_to(socket, "fetch", unique, ...args)
				return receive(unique)
			}
			bounce = function(key, callback) {
				bounces[key] = callback
			}
			receive("fetch").tie(function(socket, unique, key, ...args) {
				if not bounces[key] {
					env.whine("no bounce", key)
					return
				}
				send_to(socket, unique, bounces[key](socket, ...args))
			})
			bounce("connections", function() {
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