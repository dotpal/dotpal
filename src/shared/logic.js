const Logic = {}
{
	const is = (v) => {
		return v != undefined
	}
	Logic.is = is
	const and = (a, b) => {
		if (is(a) && is(b)) {
			return b
		}
	}
	Logic.and = and
	const or = (a, b) => {
		if (is(a)) {
			return a
		}
		else if (is(b)) {
			return b
		}
	}
	Logic.or = or
}