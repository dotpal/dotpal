const State = {}
{
	State.create = () => {
		let current
		const self = {}
		const set = Signal.create()
		set.tie((values) => {
			current = values
		})
		self.set = set.call
		self.tie = set.tie
		self.get = () => {
			return current
		}
		return self
	}
}