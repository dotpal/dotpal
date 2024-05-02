const Hooker = {}
{
	Hooker.create = () => {
		const hooker = {}
		const signals = {}
		hooker.get = (key) => {
			if (signals[key]) {
				return signals[key]
			}
			else {
				Debug.log('new listener', key)
				return signals[key] = Signal.create() // wtf lol
			}
		}
		hooker.call = (key, ...values) => {
			if (signals[key]) {
				signals[key].call(...values)
			}
			else {
				Debug.error('no key', key)
			}
		}
		return hooker
	}
}