const Network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	Network.link = (env) => {
		const Hooker = env.require('Hooker')
		const Signal = env.require('Signal')
		Network.create = (host, port) => {
			const network = {}
			const hooker = Hooker.create()
			network.close = Signal.create()
			network.connect = Signal.create()
			network.error = Signal.create()
			network.receive = hooker.get
			const socket = new WebSocket('ws://' + host + ':' + (port + 1))
			socket.onclose = network.close.call
			socket.onerror = network.error.call
			socket.onopen = network.connect.call
			socket.onmessage = (event) => {
				const values = parse(event.data)
				values.splice(1, 0, socket)
				hooker.call(...values)
			}
			const queue = []
			network.send = (...values) => {
				queue.unshift(values)
			}
			network.connect.tie(() => {
				network.send = (...values) => {
					socket.send(stringify(values))
				}
				for (let i = queue.length; i--;) {
					network.send(...queue[i])
				}
			})
			return network
		}
	}
}