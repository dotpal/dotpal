const State = {}
{
	State.load = (env) => {
		const Signal = env.require('Signal')
		State.create = () => {
			let values
			const state = {}
			const set = Signal.create()
			set.tie((values1) => {
				values = values1
			})
			state.set = set.call
			state.tie = set.tie
			state.get = () => {
				return values
			}
			return state
		}
	}
}