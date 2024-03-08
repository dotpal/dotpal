const network = {}
{
	const stringify = JSON.stringify
	const parse = JSON.parse
	const host = '192.168.1.165'
	const comm_port = 2024
	const face_port = 8000
	const listeners = {}
	network.receive = function(key) {
		if (listeners[key] !== undefined) {
			return listeners[key]
		}
		return listeners[key] = signal.create() // wtf lol
	}
	if (which() === 'client') {
		network.close = signal.create()
		network.error = signal.create()
		network.login = signal.create()
		network.connect = signal.create()
		const socket = new WebSocket('ws://' + host + ':' + comm_port)
		socket.onopen = network.connect.send
		socket.onclose = network.close.send
		socket.onerror = network.error.send
		socket.onmessage = function(event) {
			const [key, ...values] = parse(event.data)
			if (listeners[key] !== undefined) {
				values.unshift(socket)
				listeners[key].send(values)
			}
			else {
				debug.log('no key', key)
			}
		}
		// this is for sending before the network is prepared, will just queue up packets
		const queue = []
		network.send = function(values) {
			debug.log('queue network event', values)
			queue.push(values)
		}
		// then when the network finally connects, well dump them all out
		network.connect.subscribe(function() {
			debug.log('connected to the network')
			network.send = function(values) {
				debug.log('send', values)
				socket.send(stringify(values))
			}
			for (let i = 0; i < queue.length; ++i) {
				network.send(queue[i])
			}
		})
		network.receive('users_online').subscribe(function([peer, users_online]) {
			debug.log('users online is', users_online)
		})
		// this is stupid as fuck
		const remove_cookies = function() {
			const cookies = document.cookie.split(';')
			for (let i = 0; i < cookies.length; ++i) {
				const cookie = cookies[i]
				const equal = cookie.indexOf('=')
				const name = equal > -1 ? cookie.substr(0, equal) : cookie
				document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
			}
		}
		const PI = Math.PI
		const floor = Math.floor
		const deg = PI/180
		const mod = function(x, y) {
			return x - floor(x/y)*y
		}
		const get_location = function() {
			if (navigator.geolocation !== undefined) {
				let location
				navigator.geolocation.getCurrentPosition(function(position) {
					location = [mod(position.coords.latitude*deg, PI), mod(position.coords.longitude*deg, PI)]
					debug.log('location registered at coordinates', location)
				})
				return location
			}
			else {
				debug.log('geolocation is not supported by this browser')
			}
		}
		get_location()
		network.receive_cookie = signal.create()
		network.receive_cookie.subscribe(function([secret]) {
			network.send(['login', secret])
		})
		if (document.cookie !== '') {
			network.receive_cookie.send([document.cookie])
			network.login.send(document.cookie)
		}
		else {
			const form_container_element = document.createElement('container')
			document.body.appendChild(form_container_element)
			const form_element = document.createElement('form')
			form_container_element.appendChild(form_element)
			const email_label_element = document.createElement('label')
			email_label_element.innerHTML = 'email'
			form_element.appendChild(email_label_element)
			form_element.appendChild(document.createElement('br'))
			const email_input_element = document.createElement('input')
			email_input_element.type = 'text'
			email_input_element.required = true
			form_element.appendChild(email_input_element)
			form_element.appendChild(document.createElement('br'))
			const password_label_element = document.createElement('label')
			password_label_element.innerHTML = 'password'
			form_element.appendChild(password_label_element)
			const password_input_element = document.createElement('input')
			form_element.appendChild(document.createElement('br'))
			password_input_element.type = 'password'
			password_input_element.required = true
			form_element.appendChild(password_input_element)
			const login_button_element = document.createElement('button')
			form_element.appendChild(document.createElement('br'))
			login_button_element.innerHTML = 'login'
			form_element.appendChild(login_button_element)
			form_element.onsubmit = function() {
				form_container_element.remove()
				const email = email_input_element.value
				const password = password_input_element.value
				hash.digest_message(email + password).then(function(secret) {
					document.cookie = secret
					network.receive_cookie.send([secret])
				})
			}
		}
	}
	else if (which() === 'server') {
		//const net = require('net')
		const fs = require('fs')
		const http = require('http')
		const ws = require('ws')
		const face_server = http.createServer(function(request, response) {
			response.setHeader('Access-Control-Allow-Origin', '*') // idk if this is needed
			response.end(fs.readFileSync('build/index.html'))
		})
		face_server.listen(face_port)
		network.connect = signal.create()
		network.close = signal.create()
		network.error = signal.create()
		//const comm_server = new ws.WebSocketServer({server: face_server})
		const comm_server = new ws.WebSocketServer({port: comm_port})
		const sockets = []
		network.send = function(values) {
			for (const id in sockets) {
				if (sockets[id] !== undefined) {
					debug.log('send', stringify(values))
					sockets[id].send(stringify(values))
				}
			}
		}
		network.send_but = function(ignore_socket, values) {
			for (const id in sockets) {
				if (sockets[id] !== undefined && sockets[id] !== ignore_socket) {
					debug.log('send', stringify(values))
					sockets[id].send(stringify(values))
				}
			}
		}
		network.share = function(socket, values) {
			socket.send(stringify(values))
		}
		let users_online = 0
		let index = 0
		comm_server.on('connection', function(socket) {
			++users_online
			network.connect.send([socket])
			socket.send(stringify(['users_online', users_online]))
			const id = ++index
			sockets[id] = socket
			socket.on('close', function() {
				sockets[id] = undefined
				--users_online
			})
			socket.on('message', function(message) {
				const [key, ...values] = parse(message.toString())
				if (listeners[key] !== undefined) {
					values.unshift(socket)
					listeners[key].send(values)
				}
				else {
					debug.log('no key', key)
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
			debug.log('peer', id, 'connected')
			socket.on('error', function() {
				debug.log('error')
			})
			socket.once('data', function(data) {
				// upgrade it to a websocket as the first request is likely asking to do that
				const key = data.toString().match(/Sec-WebSocket-Key: (.*)/i)[1]
				socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${generate_accept_header(key)}\r\n\r\n`)
				socket.on('data', function(data) {
					//debug.log(decode_websocket_frame(data))
					//debug.log(parse(data.toString()))
					const [key, ...values] = parse(data.toString())
					if (listeners[key] !== undefined) {
						values.unshift(socket)
						listeners[key].send(values)
					}
					else {
						debug.log('no key', key)
					}
				})
			})
			socket.on('end', function() {
				debug.log('peer', id, 'disconnected')
				sockets[id] = undefined
			})
		})
		server.listen(comm_port, host, function() {
			debug.log('running')
		})
		*/
	}
}