const Hash = {}
{
	Hash.digest = async function(message) {
		const stream = new TextEncoder().encode(message)
		const hash = await crypto.subtle.digest('sha-1', stream)
		const bytes = Array.from(new Uint8Array(hash))
		const hex = bytes.map(function(byte) {
			return byte.toString(16).padStart(2, '0')
		}).join('')
		return hex
	}
}