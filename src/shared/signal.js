const Signal = {}
{
	Signal.link = (env) => {
		Signal.create = (pass) => {
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
				if (connections.length == 1) {
					env.print('this is the second connection...')
				}
				return connection
			}
			if (!pass) {
				signal.call = (...values) => {
					for (const i in connections) {
						connections[i].call(...values)
					}
				}
			}
			else {
				signal.call = (...values) => {
					values = [pass(...values)]
					for (const i in connections) {
						connections[i].call(...values)
					}
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
}