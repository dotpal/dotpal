const Network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	Network.create = function(host, comm_port, face_port) {
		const self = {}
		const listeners = {}
		self.receive = function(key) {
			if (listeners[key] !== undefined) {
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
		socket.onmessage = function(event) {
			const [key, ...values] = parse(event.data)
			if (listeners[key] !== undefined) {
				values.unshift(socket)
				listeners[key].call(values)
			}
			else {
				Debug.log('no key', key)
			}
		}
		// this is for sending before the network is prepared, will just queue up packets
		const queue = []
		self.send = function(values) {
			Debug.log('queue network event', values)
			queue.push(values)
		}
		// then when the network finally connects, well dump them all out
		self.connect.subscribe(function() {
			Debug.log('connected to the network')
			self.send = function(values) {
				Debug.log('send', values)
				socket.send(stringify(values))
			}
			for (let i = 0; i < queue.length; ++i) {
				self.send(queue[i])
			}
		})
		const netizens = document.createElement('value')
		netizens.value = 'settings'
		document.body.appendChild(netizens)
		self.receive('netizens').subscribe(function([peer, netizens]) {
			Debug.log('users online is', netizens)
		})
		return self
	}
}