const Network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	const comm_port = 2024
	const face_port = 8000
	const host = '192.168.1.165'
	const listeners = {}
	Network.receive = function(key) {
		if (listeners[key] !== undefined) {
			return listeners[key]
		}
		return listeners[key] = Signal.create() // wtf lol
	}
	Network.close = Signal.create()
	Network.connect = Signal.create()
	Network.error = Signal.create()
	const socket = new WebSocket('ws://' + host + ':' + comm_port)
	socket.onopen = Network.connect.call
	socket.onclose = Network.close.call
	socket.onerror = Network.error.call
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
	Network.send = function(values) {
		Debug.log('queue network event', values)
		queue.push(values)
	}
	// then when the network finally connects, well dump them all out
	Network.connect.subscribe(function() {
		Debug.log('connected to the network')
		Network.send = function(values) {
			Debug.log('send', values)
			socket.send(stringify(values))
		}
		for (let i = 0; i < queue.length; ++i) {
			Network.send(queue[i])
		}
	})
	const netizens = document.createElement('value')
	netizens.value = 'settings'
	document.body.appendChild(netizens)
	Network.receive('netizens').subscribe(function([peer, netizens]) {
		Debug.log('users online is', netizens)
	})
}