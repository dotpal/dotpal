const Random = {}
{
	const duh_a = 1103515245
	const duh_c = 12345
	const duh_m = 2**31
	Random.load = (env) => {
		Random.create = (value) => {
			const self = {}
			value = value || 0
			self.get = () => {
				value = (duh_a*value + duh_c)%duh_m
				return value/duh_m
			}
			self.set = (value1) => {
				value = value1
			}
			return self
		}
	}
}