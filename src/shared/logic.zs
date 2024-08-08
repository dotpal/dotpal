Logic = {}
{
	is = function(v) {
		return v isnt nil
	}
	and = function(a, b) {
		if is(a) and is(b) {
			return b
		}
	}
	or = function(a, b) {
		if is(a) {
			return a
		}
		else if is(b) {
			return b
		}
	}
	Logic.and = and
	Logic.is = is
	Logic.or = or
}