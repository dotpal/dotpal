const Network = {}
{
	const link = (env) => {
		const Hooker = env.require("Hooker")
		const Signal = env.require("Signal")
		const create = (address, port) => {
			const network = {}
			const bounces = {}
			const close = Signal.create()
			const connect = Signal.create()
			const hooker = Hooker.create()
			const host = new WebSocket("wss://" + address + ":" + port)
			const receive = hooker.get
			const send = (...args) => {
				const data = env.serializer.encode(args)
				host.send(data)
			}
			const fetch = (...args) => {
				const unique = env.get_random()
				send("fetch", unique, ...args)
				return receive(unique)
			}
			const bounce = (key, callback) => {
				bounces[key] = callback
			}
			network.bounce = bounce
			network.close = close
			network.connect = connect
			network.fetch = fetch
			network.receive = receive
			network.send = send
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
				const args = env.serializer.decode(event.data)
				hooker.call(...args)
			}
			receive("fetch").tie((socket, unique, key, ...args) => {
				if (!bounces[key]) {
					env.error("no bounce", key)
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