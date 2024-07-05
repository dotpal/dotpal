const Hash = {}
{
	const digest = async (message) => {
		const stream = new TextEncoder().encode(message)
		const hash = await crypto.subtle.digest("sha-1", stream)
		const data = Array.from(new Uint8Array(hash))
		const hex = data.map((byte) => {
			return byte.toString(16).padStart(2, "0")
		}).join("")
		return hex
	}
	Hash.digest = digest
}