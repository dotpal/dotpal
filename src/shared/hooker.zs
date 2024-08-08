Hooker = {}
{
	link = function(env) {
		Signal = env.require("Signal")
		create = function(...args) {
			hooker = {}
			signals = {}
			get = function(key, yuhhhh) {
				if signals[key] {
					return signals[key]
				}
				else {
					return signals[key] = Signal.create(yuhhhh)
				}
			}
			call = function(key, ...args) {
				if signals[key] {
					signals[key].call(...args)
				}
				else {
					env.whine("no key", key)
				}
			}
			hooker.call = call
			hooker.get = get
			return hooker
		}
		Hooker.create = create
	}
	Hooker.link = link
}