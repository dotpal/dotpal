const Hooker = {}
{
	Hooker.link = (env) => {
		const Signal = env.require('Signal')
		Hooker.create = () => {
			const hooker = {}
			const signals = {}
			hooker.get = (key) => {
				if (signals[key]) {
					return signals[key]
				}
				else {
					// env.print('new listener', key)
					return signals[key] = Signal.create() // wtf lol
				}
			}
			hooker.call = (key, ...values) => {
				if (signals[key]) {
					signals[key].call(...values)
				}
				else {
					env.error('no key', key)
				}
			}
			return hooker
		}
	}
}