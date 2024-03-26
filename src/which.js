const Which = function() {
	return typeof window !== 'undefined' && 'client' || typeof process !== 'undefined' && 'server' || undefined
}