const State = {}
{
	State.link = (env) => {
		const Signal = env.require("Signal")
		State.create = (setter, getter) => {
			// hopefully nobody initializes their data with this
			let args = "jumbojetpussyfucker123"
			const state = {}
			let changer = () => {}
			state.change = (changer1) => {
				changer = changer1
			}
			const set = Signal.create()
			set.tie((args1) => {
				if (args1 != args) {
					changer(args1)
				}
				args = args1
				setter(args1)
			})
			state.set = set.call
			state.tie = set.tie
			state.get = () => {
				return args
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