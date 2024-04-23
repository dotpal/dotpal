const State = {}
{
	State.create = () => {
		let current
		const state = {}
		const set = Signal.create()
		set.tie((values) => {
			current = values
		})
		state.set = set.call
		state.tie = set.tie
		state.get = () => {
			return current
		}
		return state
	}
}