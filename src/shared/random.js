const Random = {}
{
	const ca = 1103515245
	const cc = 12345
	const cm = 2**31
	Random.create = (v) => {
		const random = {}
		v = v || 0
		const get = () => {
			v = (ca*v + cc)%cm
			return v/cm
		}
		const set = (v1) => {
			v = v1
		}
		random.get = get
		random.set = set
		return random
	}
}