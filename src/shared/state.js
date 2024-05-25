const State = {}
{
	State.link = (env) => {
		const Signal = env.require('Signal')
		State.create = (setter, getter) => {
			let values
			const state = {}
			let changer = () => {}
			state.change = (changer1) => {
				changer = changer1
			}
			const set = Signal.create()
			set.tie((values1) => {
				if (values1 != values) {
					changer(values1)
				}
				values = values1
				setter(values1)
			})
			state.set = set.call
			state.tie = set.tie
			state.get = () => {
				return values
			}
			if (getter) {
				state.check = () => {
					state.set(getter())
				}
			}
			return state
		}
	}
}