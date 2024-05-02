const Signal = {}
{
	Signal.create = () => {
		const signal = {}
		let connections = []
		signal.once = (callback) => {
			let temporary
			temporary = signal.tie((...values) => {
				callback(...values)
				temporary.remove()
			})
			return temporary
		}
		signal.tie = (callback) => {
			const connection = {}
			connections.push(connection)
			connection.remove = () => {
				connections.splice(connections.indexOf(connection), 1)
			}
			connection.call = callback
			return connection
		}
		signal.call = (...values) => {
			for (const i in connections) {
				connections[i].call(...values)
			}
		}
		signal.remove = () => {
			for (const i in connections) {
				connections[i].remove()
			}
		}
		return signal
	}
}