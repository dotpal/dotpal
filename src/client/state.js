const State = {}
{
	State.create = () => {
		let current
		const self = {}
		const set = Signal.create()
		set.subscribe((values) => {
			current = values
		})
		self.set = set.call
		self.subscribe = set.subscribe
		self.get = () => {
			return current
		}
		return self
	}
}