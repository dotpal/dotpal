const Hooker = {}
{
	Hooker.link = (env) => {
		const Signal = env.require("Signal")
		Hooker.create = (...args) => {
			const hooker = {}
			const signals = {}
			hooker.get = (key) => {
				if (signals[key]) {
					return signals[key]
				}
				else {
					// env.print("new listener", key)
					// wtf lol
					return signals[key] = Signal.create()
				}
			}
			hooker.call = (key, ...args) => {
				if (signals[key]) {
					signals[key].call(...args)
				}
				else {
					env.error("no key", key, ...args)
				}
			}
			return hooker
		}
	}
}