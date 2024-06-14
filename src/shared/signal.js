const Signal = {}
{
	Signal.create = (pass) => {
		const signal = {}
		let connections = []
		signal.once = (callback) => {
			let connection
			connection = signal.tie((...args) => {
				connection.remove()
				callback(...args)
			})
			return connection
		}
		signal.tie = (callback) => {
			const connection = {}
			connections.push(connection)
			connection.remove = () => {
				connections.splice(connections.indexOf(connection), 1)
			}
			connection.call = callback
			if (connections.length >= 2) {
				// console.trace("this is the second connection...")
			}
			return connection
		}
		if (!pass) {
			signal.call = (...args) => {
				for (const connection of connections) {
					connection.call(...args)
				}
			}
		}
		else {
			signal.call = (...args) => {
				args = [pass(...args)]
				for (const connection of connections) {
					connection.call(...args)
				}
			}
		}
		signal.remove = () => {
			for (const connection of connections) {
				connection.remove()
			}
		}
		return signal
	}
}