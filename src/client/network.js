const Network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	Network.create = (host, comm_port, face_port) => {
		const self = {}
		const listeners = {}
		self.receive = (key) => {
			if (listeners[key]) {
				return listeners[key]
			}
			return listeners[key] = Signal.create() // wtf lol
		}
		self.close = Signal.create()
		self.connect = Signal.create()
		self.error = Signal.create()
		const socket = new WebSocket('ws://' + host + ':' + comm_port)
		socket.onopen = self.connect.call
		socket.onclose = self.close.call
		socket.onerror = self.error.call
		socket.onmessage = (event) => {
			const [key, ...values] = parse(event.data)
			if (listeners[key]) {
				values.unshift(socket)
				listeners[key].call(values)
			}
			else {
				Debug.log('no key', key)
			}
		}
		// this is for sending before the network is prepared, will just queue up packets
		const queue = []
		self.send = (values) => {
			//Debug.log('queue network event', values)
			queue.push(values)
		}
		// then when the network finally connects, well dump them all out
		self.connect.tie(() => {
			//Debug.log('connected to the network')
			self.send = (values) => {
				//Debug.log('send', values)
				socket.send(stringify(values))
			}
			for (let i = 0; i < queue.length; ++i) {
				self.send(queue[i])
			}
		})
		const netizens = document.createElement('value')
		netizens.value = 'settings'
		document.body.appendChild(netizens)
		self.receive('netizens').tie(([peer, netizens]) => {
			// Debug.log('users online is', netizens)
		})
		return self
	}
}