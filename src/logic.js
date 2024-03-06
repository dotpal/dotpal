const logic = {}
{
	const is = function(v) {
		return v !== undefined
	}
	logic.is = is
	const and = function(a, b) {
		if (is(a) && is(b)) {
			return b
		}
	}
	logic.and = and
	const or = function(a, b) {
		if (is(a)) {
			return a
		}
		else if (is(b)) {
			return b
		}
	}
	logic.or = or
}