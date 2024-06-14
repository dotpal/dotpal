const Network = {}
{
	Network.link = (env) => {
		const Hooker = env.require("Hooker")
		const Serial = env.require("Serial")
		const Signal = env.require("Signal")
		Network.create = (address, port) => {
			const network = {}
			const close = Signal.create()
			const connect = Signal.create()
			const hooker = Hooker.create()
			const receive = hooker.get
			const host = new WebSocket("wss://" + address + ":" + port)
			host.onclose = () => {
				close.call(host)
			}
			host.onerror = () => {
				env.error("network error")
			}
			host.onopen = () => {
				connect.call(host)
			}
			host.onmessage = () => {
				hooker.call(...Serial.decode(event.data))
			}
			const send = (...args) => {
				host.send(Serial.encode(args))
			}
			network.fetch = (...args) => {
				const unique = env.get_random()
				send("fetch", unique, ...args)
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
			network.close = close
			network.connect = connect
			network.receive = receive
			network.send = send
			return network
		}
	}
}