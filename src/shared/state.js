const State = {}
{
	const link = (env) => {
		const Signal = env.require("Signal")
		const create = (setter, getter) => {
			const state = {}
			// hopefully nobody initializes their data with this
			let args = "jumbojetpussyfucker123"
			let changer = () => {}
			const change = (changer1) => {
				changer = changer1
			}
			const pooper = Signal.create()
			const set = pooper.call
			pooper.tie((args1) => {
				if (args1 != args) {
					changer(args1)
				}
				args = args1
				setter(args1)
			})
			const get = () => {
				return args
			}
			if (getter) {
				const check = () => {
					set(getter())
				}
				state.check = check
			}
			state.change = change
			state.get = get
			state.set = set
			state.tie = pooper.tie
			return state
		}
		State.create = create
	}
	State.link = link
}