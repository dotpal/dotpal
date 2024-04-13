const Tryer = {}
{
	// idk for now but whatever
	Tryer.create = (passer) => {
		const self = {}
		const signals = {}
		signals[false] = Signal.create()
		signals[true] = Signal.create()
		self.pass = (callback) => {
			const [passed, ...values] = passer()
			const connection = signals[true].subscribe(callback)
			if (passed === true) {
				signals[true].call(values)
				//connection.remove()
			}
			return connection
		}
		self.fail = (callback) => {
			const [passed, ...values] = passer()
			const connection = signals[false].subscribe(callback)
			if (passed === false) {
				signals[false].call(values)
				//connection.remove()
			}
			return connection
		}
		self.check = (extra) => {
			const [passed, ...values] = passer()
			signals[passed].call(values.concat(extra))
		}
		return self
	}
}