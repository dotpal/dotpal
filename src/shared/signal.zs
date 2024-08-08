Signal = {}
{
	create = function(tfunc) {
		signal = {}
		connections = []
		soft call
		tie = function(call) {
			connection = {}
			connections.push(connection)
			connection.remove = function() {
				connections.splice(connections.indexOf(connection), 1)
			}
			if connections.length >= 2 {
				// connectionsole.trace("this is the seconnectiond connection...")
			}
			connection.call = call
			return connection
		}
		once = function(call) {
			connection = tie(function(...args) {
				connection.remove()
				call(...args)
			})
			return connection
		}
		transform = function(tfunc) {
			if not tfunc {
				old call = function(...args) {
					for connection of connections {
						connection.call(...args)
					}
				}
			}
			else {
				old call = function(...args) {
					old args = tfunc(...args)
					for connection of connections {
						connection.call(...args)
					}
				}
			}
			signal.call = call
		}
		remove = function() {
			for connection of connections {
				connection.remove()
			}
		}
		signal.once = once
		signal.remove = remove
		signal.tie = tie
		signal.transform = transform
		transform(tfunc)
		return signal
	}
	Signal.create = create
}