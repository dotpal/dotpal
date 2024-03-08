const signal = {}
{
	signal.create = function() {
		const self = {}
		const events = []
		self.subscribe = function(callback) {
			events.push(callback)
			return function() {
				events.splice(events.indexOf(callback), 1)
			}
		}
		self.send = function(values) {
			for (const i in events) {
				events[i](values)
			}
		}
		return self
	}
}