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
			const get_descending_typed = (stack) => {
				console.log("stack", stack)
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
				// for (let i = 0; i < descending_typed.length; ++i) {
				// 	const [parent, j] = descending_typed[i]
				// 	env.print(parent[j])
				// }
				return descending_typed
			}
			const decode = (data) => {
				console.log("decode", data)
				const args = parse(data)
				// env.print("in decode", args)
				const parent = [args]
				const stack = [[parent, 0]]
				const descending_typed = get_descending_typed(stack)
				// if (descending_typed[0]) {
				// 	descending_typed[0][0][descending_typed[0][1]][0] = "xd"
				// }
				while (descending_typed.length > 0) {
					const [parent, i] = descending_typed.pop()
					const current = parent[i]
					const decoder = decoders[current.type]
					if (decoder) {
						// env.print("decoder", current)
						parent[i] = decoder(current)
						// env.print("decode", current.type)
					}
					else {
						env.error("missing decoder", current.type)
					}
				}
				// env.print("out decode", args)
				return args
			}
			const encode = (args) => {
				console.log("encode", args)
				// env.print("in encode", args)
				const parent = [args]
				const stack = [[parent, 0]]
				const descending_typed = get_descending_typed(stack)
				// for (let i = 0; i < descending_typed.length; ++i) {
				// 	env.print("dtyped", descending_typed[i])
				// }
				while (descending_typed.length > 0) {
					const [parent, i] = descending_typed.pop()
					const current = parent[i]
					const encoder = encoders[current.type]
					if (encoder) {
						// env.print("encoder", current)
						parent[i] = encoder(current)
						// env.print("encode", current.type)
					}
					else {
						env.error("missing encoder", current.type)
					}
				}
				// env.print("encode", args)
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