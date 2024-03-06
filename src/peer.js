const peer = {}
{
	const stringify = JSON.stringify
	peer.create = function(socket) {
		const self = {}
		self.send = function(values) {
			socket.write(stringify(values))
		}
		return self
	}
}