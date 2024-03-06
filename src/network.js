const network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	const host = '127.0.0.1'
	const comm_port = 2024
	const face_port = 8000
	if (which() === 'client') {
		network.create = function() {
			const self = {}
			self.open = signal.create()
			self.close = signal.create()
			self.error = signal.create()
			const socket = new WebSocket('ws://' + host + ':' + comm_port)
			socket.onopen = self.open.send
			socket.onclose = self.close.send
			socket.onerror = self.error.send
			const listeners = {}
			self.receive = function(key) {
				if (listeners[key]) {
					return listeners[key]
				}
				return listeners[key] = signal.create() // wtf lol
			}
			socket.message = function(data) {
				const [key, ...values] = parse(data)
				if (listeners[key]) {
					listeners[key].send(values)
				}
				else {
					console.log('no key', key)
				}
			}
			self.send = function(values) {
				console.log('send', stringify(values))
				socket.send(stringify(values))
			}
			return self
		}
	}
	else if (which() === 'server') {
		const fs = require('fs')
		const http = require('http')
		//const net = require('net')
		const ws = require('ws')
		const face_server = http.createServer(function(request, response) {
			response.end(fs.readFileSync('build/index.html'))
		})
		face_server.listen(face_port)
		network.create = function() {
			const self = {}
			self.open = signal.create()
			self.close = signal.create()
			self.error = signal.create()
			//const comm_server = new ws.WebSocketServer({server: face_server})
			const comm_server = new ws.WebSocketServer({port: comm_port})
			const sockets = []
			self.send = function(values) {
				for (const id in sockets) {
					if (sockets[id]) {
						sockets[id].send(stringify(values))
					}
				}
			}
			const listeners = {}
			self.receive = function(key) {
				if (listeners[key]) {
					return listeners[key]
				}
				return listeners[key] = signal.create() // bruh
			}
			let index = 0
			comm_server.on('connection', socket => {
				let id = ++index
				let peer_ = peer.create(socket)
				sockets[id] = peer_
				//sockets[id] = peer.create(socket)
				console.log('asd')
				socket.on('close', () =>
					sockets[id] = undefined
				)
				socket.on('message', message => {
					let [key, ...values] = parse(message.toString())
					if (listeners[key]) {
						values.unshift(peer_)
						listeners[key].fire(values)
					}
					else {
						console.log('no key', key)
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
				return Array.from(byte_array, byte => {
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
				} else if (payloadLength === 127) {
					// Note: This is a simplified example, handling 64-bit payloads properly would require BigInt
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
				} else {
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
				frame[0] = 0x81; // Final frame, Text data
				frame[1] = Buffer.byteLength(message)
				// Copy the message payload into the frame
				frame.write(message, 2)
				// Send the frame to the server
				socket.write(frame)
			}
			let index = 0
			const server = net.createServer(function(socket) {
				const id = ++index
				const the_peer = peer.create(socket)
				sockets[id] = the_peer
				console.log('peer', id, 'connected')
				socket.on('error', function() {
					console.log('error')
				})
				socket.once('data', function(data) {
					// upgrade it to a websocket as the first request is likely asking to do that
					const key = data.toString().match(/Sec-WebSocket-Key: (.*)/i)[1]
					socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${generate_accept_header(key)}\r\n\r\n`)
					socket.on('data', function(data) {
						//console.log(decode_websocket_frame(data))
						//console.log(parse(data.toString()))
						const [key, ...values] = parse(data.toString())
						if (listeners[key]) {
							values.unshift(the_peer)
							listeners[key].send(values)
						}
						else {
							console.log('no key', key)
						}
					})
				})
				socket.on('end', function() {
					console.log('peer', id, 'disconnected')
					sockets[id] = undefined
				})
			})
			server.listen(comm_port, host, function() {
				console.log('running')
			})
			*/
			return self
		}
	}
}