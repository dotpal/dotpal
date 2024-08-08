Hash = {}
{
	digest = async function(message) {
		stream = new TextEncoder().encode(message)
		hash = await crypto.subtle.digest("sha-1", stream)
		data = Array.from(new Uint8Array(hash))
		hex = data.map(function(byte) {
			return byte.toString(16).padStart(2, "0")
		}).join("")
		return hex
	}
	Hash.digest = digest
}