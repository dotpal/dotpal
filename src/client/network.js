const Network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	Network.link = (env) => {
		const Hooker = env.require('Hooker')
		const Signal = env.require('Signal')
		Network.create = (address, port) => {
			// We should really make everything a peer instead of a socket... (TODO!)
			const network = {}
			const hooker = Hooker.create()
			const close = Signal.create()
			const connect = Signal.create()
			const error = Signal.create()
			const host = new WebSocket('wss://' + address + ':' + port)
			const Peer = {}
			Peer.create = (socket) => {
				const peer = {}
				const receive = hooker.get
				peer.receive = receive
				const send = (...values) => {
					socket.send(stringify(values))
				}
				peer.send = send
				peer.fetch = (...values) => {
					const unique = env.random()
					send('fetch', unique, ...values)
					return receive(unique)
				}
				peer.remove = () => {
					// hookers[socket] = undefined
					// p = undefined
				}
				return peer
			}
			const peer = Peer.create(host)
			host.onclose = () => {
				close.call(peer)
				peer.remove()
			}
			host.onerror = () => {
				error.call(peer)
			}
			host.onopen = () => {
				connect.call(Peer.create(host))
			}
			host.onmessage = (event) => {
				// env.print(...parse(event.data))
				hooker.call(...parse(event.data))
			}
			network.connect = connect
			return network
		}
	}
}