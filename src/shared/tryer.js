const Tryer = {}
{
	Tryer.create = (get, set, fix) => {
		const tryer = {}
		let passed1
		tryer.get = () => {
			const [passed, value] = get()
			if (passed) {
				tryer.get = () => {
					return value
				}
			}
			fix(passed)
			return value
		}
		tryer.set = set
		return tryer
	}
}