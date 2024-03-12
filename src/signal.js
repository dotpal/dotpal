const Signal = {}
{
	Signal.create = function() {
		const self = {}
		const callbacks = []
		self.once = function(callback) {
			let connection
			connection = self.subscribe(function(values) {
				callback(values)
				connection.remove()
			})
			return connection
		}
		self.subscribe = function(callback) {
			const connection = {}
			callbacks.push(callback)
			connection.remove = function() {
				callbacks.splice(callbacks.indexOf(callback), 1)
			}
			return connection
		}
		self.call = function(values) {
			for (const i in callbacks) {
				callbacks[i](values)
			}
		}
		self.clear = function() {
			callbacks = []
		}
		return self
	}
}