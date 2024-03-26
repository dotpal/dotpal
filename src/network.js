const Network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	const host = '192.168.1.165'
	const comm_port = 2024
	const face_port = 8000
	const listeners = {}
	Network.receive = function(key) {
		if (listeners[key] !== undefined) {
			return listeners[key]
		}
		return listeners[key] = Signal.create() // wtf lol
	}
	if (Which() === 'client') {
		Network.close = Signal.create()
		Network.error = Signal.create()
		Network.connect = Signal.create()
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
	else if (Which() === 'server') {
		//const net = require('net')
		const fs = require('fs')
		const http = require('http')
		const ws = require('ws')
		const face_server = http.createServer(function(request, response) {
			//response.setHeader('Access-Control-Allow-Origin', '*') // idk if this is needed
			response.end(fs.readFileSync('build/index.html'))
		})
		face_server.listen(face_port)
		Network.connect = Signal.create()
		Network.close = Signal.create()
		Network.error = Signal.create()
		//const comm_server = new ws.WebSocketServer({server: face_server})
		const comm_server = new ws.WebSocketServer({port: comm_port})
		const sockets = []
		Network.send = function(values) {
			for (const id in sockets) {
				if (sockets[id] !== undefined) {
					Debug.log('send', stringify(values))
					sockets[id].send(stringify(values))
				}
			}
		}
		Network.send_but = function(ignore_socket, values) {
			for (const id in sockets) {
				if (sockets[id] !== undefined && sockets[id] !== ignore_socket) {
					Debug.log('send', stringify(values))
					sockets[id].send(stringify(values))
				}
			}
		}
		Network.share = function(socket, values) {
			socket.send(stringify(values))
		}
		let netizens = 0
		let index = 0
		comm_server.on('connection', function(socket) {
			++netizens
			Network.connect.call([socket])
			socket.send(stringify(['netizens', netizens]))
			const id = ++index
			sockets[id] = socket
			socket.on('close', function() {
				sockets[id] = undefined
				--netizens
			})
			socket.on('message', function(message) {
				const [key, ...values] = parse(message.toString())
				if (listeners[key] !== undefined) {
					values.unshift(socket)
					listeners[key].call(values)
				}
				else {
					Debug.log('no key', key)
				}
			})
		})
		/*
		const crypto = require('crypto')
		const generate_accept_header = function(key) {
			const magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
			return crypto.createHash('sha1').update(key + magic).digest('base64')
		}
		const send_websocket_message = function(socket, message) {
			socket.write(Buffer.from(`81${Buffer.from(message).toString('hex')}`, 'hex'))
		}
		const byte_array_to_hex = function(byte_array) {
			return Array.from(byte_array, function(byte) {
				return ('0' + (byte & 0xff).toString(16)).slice(-2)
			}).join('')
		}
		const decode_websocket_frame = function(frameBytes) {
			const opcode = frameBytes[0] & 0x0f
			const fin = (frameBytes[0] & 0x80) !== 0
			const masked = (frameBytes[1] & 0x80) !== 0
			let payloadLength = frameBytes[1] & 0x7f
			let mask
			let payloadData
			let payloadStartIndex = 2
			if (payloadLength === 126) {
				payloadLength = frameBytes.readUInt16BE(2)
				payloadStartIndex = 4
			}
			else if (payloadLength === 127) {
				// this is a simplified example, handling 64-bit payloads properly would require bigint
				payloadLength = frameBytes.readUInt32BE(2)*pow(2, 32) + frameBytes.readUInt32BE(6)
				payloadStartIndex = 10
			}
			if (masked) {
				mask = frameBytes.slice(payloadStartIndex, payloadStartIndex + 4)
				payloadStartIndex += 4
				payloadData = frameBytes.slice(payloadStartIndex)
				for (let i = 0; i < payloadData.length; i++) {
					payloadData[i] ^= mask[i%4]
				}
			}
			else {
				payloadData = frameBytes.slice(payloadStartIndex)
			}
			return {
				opcode,
				fin,
				payload: payloadData.toString('utf8')
			}
		}
		const send_websocket_message = function(socket, message) {
			const frame = Buffer.alloc(2 + Buffer.byteLength(message))
			frame[0] = 0x81; // final frame, text data
			frame[1] = Buffer.byteLength(message)
			// copy the message payload into the frame
			frame.write(message, 2)
			// send the frame to the server
			socket.write(frame)
		}
		let index = 0
		const server = net.createServer(function(socket) {
			const id = ++index
			const socket = peer.create(socket)
			sockets[id] = socket
			Debug.log('peer', id, 'connected')
			socket.on('error', function() {
				Debug.log('error')
			})
			socket.once('data', function(data) {
				// upgrade it to a websocket as the first request is likely asking to do that
				const key = data.toString().match(/Sec-WebSocket-Key: (.*)/i)[1]
				socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${generate_accept_header(key)}\r\n\r\n`)
				socket.on('data', function(data) {
					//Debug.log(decode_websocket_frame(data))
					//Debug.log(parse(data.toString()))
					const [key, ...values] = parse(data.toString())
					if (listeners[key] !== undefined) {
						values.unshift(socket)
						listeners[key].call(values)
					}
					else {
						Debug.log('no key', key)
					}
				})
			})
			socket.on('end', function() {
				Debug.log('peer', id, 'disconnected')
				sockets[id] = undefined
			})
		})
		server.listen(comm_port, host, function() {
			Debug.log('running')
		})
		*/
	}
}