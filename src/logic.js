const Logic = {}
{
	const is = function(v) {
		return v !== undefined
	}
	Logic.is = is
	const and = function(a, b) {
		if (is(a) && is(b)) {
			return b
		}
	}
	Logic.and = and
	const or = function(a, b) {
		if (is(a)) {
			return a
		}
		else if (is(b)) {
			return b
		}
	}
	Logic.or = or
}