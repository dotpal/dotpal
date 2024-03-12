const Tryer = {}
{
	// idk for now but whatever
	Tryer.create = function(passer) {
		const self = {}
		const signals = {}
		signals[false] = Signal.create()
		signals[true] = Signal.create()
		self.pass = function(callback) {
			const [passed, ...values] = passer()
			const connection = signals[true].subscribe(callback)
			if (passed === true) {
				signals[true].call(values)
				//connection.remove()
			}
			return connection
		}
		self.fail = function(callback) {
			const [passed, ...values] = passer()
			const connection = signals[false].subscribe(callback)
			if (passed === false) {
				signals[false].call(values)
				//connection.remove()
			}
			return connection
		}
		self.check = function(extra) {
			if (extra === undefined) {
				extra = []
			}
			const [passed, ...values] = passer()
			signals[passed].call(values.concat(extra))
		}
		return self
	}
}