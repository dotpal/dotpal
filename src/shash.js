const shash = {}
{
	shash.shash1 = function(x) {
		return x
	}
	shash.shash2 = function(x, y) {
		return x + (x + y)*(x + y + 1)/2
	}
	shash.shash3 = function(x, y, z) {
		return x + (x + y)*(x + y + 1)/2 + (x + y + z)*(x + y + z + 1)*(x + y + z + 2)/6
	}
}