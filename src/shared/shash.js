const Shash = {}
{
	const shash1 = (x) => {
		return x
	}
	const shash2 = (x, y) => {
		return x + (x + y)*(x + y + 1)/2
	}
	const shash3 = (x, y, z) => {
		return x + (x + y)*(x + y + 1)/2 + (x + y + z)*(x + y + z + 1)*(x + y + z + 2)/6
	}
	Shash.shash1 = shash1
	Shash.shash2 = shash2
	Shash.shash3 = shash3
}