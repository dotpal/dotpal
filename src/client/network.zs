Network = {}
{
	link = function(env) {
		Hooker = env.require("Hooker")
		Signal = env.require("Signal")
		create = function(address, port) {
			network = {}
			bounces = {}
			close = Signal.create()
			connect = Signal.create()
			hooker = Hooker.create()
			host = new WebSocket("wss://" + address + ":" + port)
			receive = hooker.get
			send = function(...args) {
				data = env.serializer.encode(args)
				host.send(data)
			}
			fetch = function(...args) {
				unique = env.get_random()
				send("fetch", unique, ...args)
				return receive(unique)
			}
			bounce = function(key, callback) {
				bounces[key] = callback
			}
			network.bounce = bounce
			network.close = close
			network.connect = connect
			network.fetch = fetch
			network.receive = receive
			network.send = send
			host.onclose = function() {
				close.call(host)
			}
			host.onerror = function() {
				env.whine("network error")
			}
			host.onopen = function() {
				connect.call(host)
			}
			host.onmessage = function() {
				args = env.serializer.decode(event.data)
				hooker.call(...args)
			}
			receive("fetch").tie(function(socket, unique, key, ...args) {
				if not bounces[key] {
					env.whine("no bounce", key)
					return
				}
				send_to(socket, unique, bounces[key](socket, ...args))
			})
			return network
		}
		Network.create = create
	}
	Network.link = link
}