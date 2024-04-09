const Shash = {}
{
	Shash.shash1 = function(x) {
		return x
	}
	Shash.shash2 = function(x, y) {
		return x + (x + y)*(x + y + 1)/2
	}
	Shash.shash3 = function(x, y, z) {
		return x + (x + y)*(x + y + 1)/2 + (x + y + z)*(x + y + z + 1)*(x + y + z + 2)/6
	}
}