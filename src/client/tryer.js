const Tryer = {}
{
	// idk for now but whatever
	Tryer.create = (passer) => {
		const tryer = {}
		const signals = {}
		signals[false] = Signal.create()
		signals[true] = Signal.create()
		tryer.pass = (callback) => {
			const [passed, ...values] = passer()
			const connection = signals[true].tie(callback)
			if (passed === true) {
				signals[true].call(values)
				//connection.remove()
			}
			return connection
		}
		tryer.fail = (callback) => {
			const [passed, ...values] = passer()
			const connection = signals[false].tie(callback)
			if (passed === false) {
				signals[false].call(values)
				//connection.remove()
			}
			return connection
		}
		tryer.check = (extra) => {
			const [passed, ...values] = passer()
			signals[passed].call(values.concat(extra))
		}
		return tryer
	}
}