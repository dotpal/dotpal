State = {}
{
	link = function(env) {
		Signal = env.require("Signal")
		create = function(setter, getter) {
			state = {}
			// hopefully nobody initializes their data with this
			soft args = "jumbojetpussyfucker123"
			soft changer = function() {}
			change = function(changer1) {
				old changer = changer1
			}
			pooper = Signal.create()
			set = pooper.call
			pooper.tie(function(args1) {
				if args1 isnt args {
					changer(args1)
				}
				old args = args1
				setter(args1)
			})
			get = function() {
				return args
			}
			if getter {
				check = function() {
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