const Signal = {}
{
	Signal.create = function() {
		const signal = {}
		let connections = []
		signal.once = function(callback) {
			let temporary
			temporary = signal.subscribe(function(values) {
				callback(values)
				temporary.remove()
			})
			return temporary
		}
		signal.subscribe = function(callback) {
			const connection = {}
			connections.push(connection)
			connection.remove = function() {
				connections.splice(connections.indexOf(connection), 1)
			}
			connection.call = callback
			return connection
		}
		signal.call = function(values) {
			for (const i in connections) {
				connections[i].call(values)
			}
		}
		signal.remove = function() {
			for (const i in connections) {
				connections[i].remove()
			}
		}
		return signal
	}
}