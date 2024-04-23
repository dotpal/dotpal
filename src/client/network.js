const Network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	Network.create = (host, port) => {
		const network = {}
		const listeners = Listeners.create()
		network.close = Signal.create()
		network.connect = Signal.create()
		network.error = Signal.create()
		network.receive = listeners.set
		const socket = new WebSocket('ws://' + host + ':' + port)
		socket.onclose = network.close.call
		socket.onerror = network.error.call
		socket.onopen = network.connect.call
		socket.onmessage = (event) => {
			const [key, ...values] = parse(event.data)
			values.unshift(socket)
			listeners.call(key, values)
		}
		const queue = []
		network.send = (values) => {
			queue.unshift(values)
		}
		network.connect.tie(() => {
			network.send = (values) => {
				socket.send(stringify(values))
			}
			for (let i = queue.length; i--;) {
				network.send(queue[i])
			}
		})
		return network
	}
}