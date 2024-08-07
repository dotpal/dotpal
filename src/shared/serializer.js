const Serializer = {}
{
	const parse = JSON.parse
	const stringify = JSON.stringify
	const link = (env) => {
		const create = () => {
			const serializer = {}
			const decoders = {}
			const encoders = {}
			const set_encoder = (key, callback) => {
				encoders[key] = callback
			}
			const set_decoder = (key, callback) => {
				decoders[key] = callback
			}
			const get_descending_typed = (top) => {
				const parent = [top]
				const stack = [[parent, 0]]
				const descending_typed = []
				while (stack.length > 0) {
					const [parent, i] = stack.pop()
					const current = parent[i]
					if (current.type) {
						descending_typed.push([parent, i])
					}
					if (typeof current == "object") {
						for (const i in current) {
							stack.push([current, i])
						}
					}
				}
				return descending_typed
			}
			const decode = (data) => {
				const args = parse(data)
				const descending_typed = get_descending_typed(args)
				while (descending_typed.length > 0) {
					const [parent, i] = descending_typed.pop()
					const current = parent[i]
					const decoder = decoders[current.type]
					if (decoder) {
						parent[i] = decoder(current)
					}
					else {
						env.error("missing decoder", current.type)
					}
				}
				return args
			}
			const encode = (args) => {
				const descending_typed = get_descending_typed(args)
				while (descending_typed.length > 0) {
					const [parent, i] = descending_typed.pop()
					const current = parent[i]
					const encoder = encoders[current.type]
					if (encoder) {
						parent[i] = encoder(current)
					}
					else {
						env.error("missing encoder", current.type)
					}
				}
				const data = stringify(args)
				return data
			}
			serializer.decode = decode
			serializer.encode = encode
			serializer.set_decoder = set_decoder
			serializer.set_encoder = set_encoder
			return serializer
		}
		Serializer.create = create
	}
	Serializer.link = link
}