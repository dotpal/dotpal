const Logic = {}
{
	const is = (v) => {
		return v != undefined
	}
	const and = (a, b) => {
		if (is(a) && is(b)) {
			return b
		}
	}
	const or = (a, b) => {
		if (is(a)) {
			return a
		}
		else if (is(b)) {
			return b
		}
	}
	Logic.and = and
	Logic.is = is
	Logic.or = or
}