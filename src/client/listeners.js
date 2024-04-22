const Listeners = {}
{
	Listeners.create = () => {
		const listeners = {}
		const all = {}
		listeners.set = (key) => {
			if (all[key]) {
				return all[key]
			}
			else {
				Debug.log('new listener', key)
				return all[key] = Signal.create() // wtf lol
			}
		}
		listeners.call = (key, values) => {
			if (all[key]) {
				all[key].call(values)
			}
			else {
				Debug.error('no key', key)
			}
		}
		return listeners
	}
}