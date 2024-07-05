const Hooker = {}
{
	const link = (env) => {
		const Signal = env.require("Signal")
		const create = (...args) => {
			const hooker = {}
			const signals = {}
			const get = (key, yuhhhh) => {
				if (signals[key]) {
					return signals[key]
				}
				else {
					return signals[key] = Signal.create(yuhhhh)
				}
			}
			const call = (key, ...args) => {
				if (signals[key]) {
					signals[key].call(...args)
				}
				else {
					env.error("no key", key)
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