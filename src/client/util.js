const Utils = {}
{
	Utils.get_copy = (object) => {
		return structuredClone(object)
	}
	Utils.adjust = (from, to) => {
		// gotta be to
		for (const i in to) {
			from[i] = to[i] || from[i]
		}
	}
}