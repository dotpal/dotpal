const Network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	Network.create = (host, comm_port, face_port) => {
		const self = {}
		const listeners = {}
		self.receive = (key) => {
			Debug.log('new listener', key)
			if (listeners[key]) {
				return listeners[key]
			}
			return listeners[key] = Signal.create() // wtf lol
		}
		//const net = require('net')
		const fs = require('fs')
		const http = require('http')
		const ws = require('ws')
		const face_server = http.createServer((request, response) => {
			//response.setHeader('Access-Control-Allow-Origin', '*') // idk if this is needed
			response.setHeader('Content-Type', 'text/html')
			response.end(fs.readFileSync('build/index.html'))
		})
		self.connect = Signal.create()
		self.close = Signal.create()
		self.error = Signal.create()
		//const comm_server = new ws.WebSocketServer({server: face_server})
		const comm_server = new ws.WebSocketServer({port: comm_port})
		const sockets = []
		self.send = (values) => {
			for (const id in sockets) {
				if (sockets[id]) {
					Debug.log('send', stringify(values))
					sockets[id].send(stringify(values))
				}
			}
		}
		self.send_but = (ignore_socket, values) => {
			for (const id in sockets) {
				if (sockets[id] && sockets[id] !== ignore_socket) {
					Debug.log('send', stringify(values))
					sockets[id].send(stringify(values))
				}
			}
		}
		self.share = (socket, values) => {
			socket.send(stringify(values))
		}
		let netizens = 0
		let index = 0
		comm_server.on('connection', (socket) => {
			++netizens
			self.connect.call([socket])
			socket.send(stringify(['netizens', netizens]))
			const id = ++index
			sockets[id] = socket
			socket.on('close', () => {
				sockets[id] = undefined
				--netizens
			})
			socket.on('message', (message) => {
				const [key, ...values] = parse(message.toString())
				if (listeners[key]) {
					values.unshift(socket)
					listeners[key].call(values)
				}
				else {
					Debug.log('no key', key)
				}
			})
		})
		self.listen = () => {
			face_server.listen(face_port)
		}
		return self
	}
	/*
	const crypto = require('crypto')
	const generate_accept_header = (key) => {
		const magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
		return crypto.createHash('sha1').update(key + magic).digest('base64')
	}
	const send_websocket_message = (socket, message) => {
		socket.write(Buffer.from(`81${Buffer.from(message).toString('hex')}`, 'hex'))
	}
	const byte_array_to_hex = (byte_array) => {
		return Array.from(byte_array, (byte) => {
			return ('0' + (byte & 0xff).toString(16)).slice(-2)
		}).join('')
	}
	const decode_websocket_frame = (frameBytes) => {
		const opcode = frameBytes[0] & 0x0f
		const fin = (frameBytes[0] & 0x80) !== 0
		const masked = (frameBytes[1] & 0x80) !== 0
		let payloadLength = frameBytes[1] & 0x7f
		let mask
		let payloadData
		let payloadStartIndex = 2
		if (payloadLength === 126) => {
			payloadLength = frameBytes.readUInt16BE(2)
			payloadStartIndex = 4
		}
		else if (payloadLength === 127) => {
			// this is a simplified example, handling 64-bit payloads properly would require bigint
			payloadLength = frameBytes.readUInt32BE(2)*pow(2, 32) + frameBytes.readUInt32BE(6)
			payloadStartIndex = 10
		}
		if (masked) => {
			mask = frameBytes.slice(payloadStartIndex, payloadStartIndex + 4)
			payloadStartIndex += 4
			payloadData = frameBytes.slice(payloadStartIndex)
			for (let i = 0; i < payloadData.length; i++) => {
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
	const send_websocket_message = (socket, message) => {
		const frame = Buffer.alloc(2 + Buffer.byteLength(message))
		frame[0] = 0x81; // final frame, text data
		frame[1] = Buffer.byteLength(message)
		// copy the message payload into the frame
		frame.write(message, 2)
		// send the frame to the server
		socket.write(frame)
	}
	let index = 0
	const server = net.createServer((socket) => {
		const id = ++index
		const socket = peer.create(socket)
		sockets[id] = socket
		Debug.log('peer', id, 'connected')
		socket.on('error', () => {
			Debug.log('error')
		})
		socket.once('data', (data) => {
			// upgrade it to a websocket as the first request is likely asking to do that
			const key = data.toString().match(/Sec-WebSocket-Key: (.*)/i)[1]
			socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${generate_accept_header(key)}\r\n\r\n`)
			socket.on('data', (data) => {
				//Debug.log(decode_websocket_frame(data))
				//Debug.log(parse(data.toString()))
				const [key, ...values] = parse(data.toString())
				if (listeners[key]) => {
					values.unshift(socket)
					listeners[key].call(values)
				}
				else {
					Debug.log('no key', key)
				}
			})
		})
		socket.on('end', () => {
			Debug.log('peer', id, 'disconnected')
			sockets[id] = undefined
		})
	})
	server.listen(comm_port, host, () => {
		Debug.log('running')
	})
	*/
}