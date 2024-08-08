Random = {}
{
	ca = 1103515245
	cc = 12345
	cm = 2**31
	Random.create = function(v) {
		random = {}
		old v = v or 0
		get = function() {
			old v = (ca*v + cc)%cm
			return v/cm
		}
		set = function(v1) {
			old v = v1
		}
		random.get = get
		random.set = set
		return random
	}
}