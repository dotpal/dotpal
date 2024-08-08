Serializer = {}
{
	parse = JSON.parse
	stringify = JSON.stringify
	link = function(env) {
		create = function() {
			serializer = {}
			decoders = {}
			encoders = {}
			set_encoder = function(key, callback) {
				encoders[key] = callback
			}
			set_decoder = function(key, callback) {
				decoders[key] = callback
			}
			get_descending_typed = function(top) {
				soft parent = [top]
				stack = [[parent, 0]]
				descending_typed = []
				while stack.length > 0 {
					[parent, i] = stack.pop()
					current = parent[i]
					if current.type {
						descending_typed.push([parent, i])
					}
					if typeof current is "object" {
						for i in current {
							stack.push([current, i])
						}
					}
				}
				return descending_typed
			}
			decode = function(data) {
				args = parse(data)
				descending_typed = get_descending_typed(args)
				while descending_typed.length > 0 {
					[parent, i] = descending_typed.pop()
					current = parent[i]
					decoder = decoders[current.type]
					if decoder {
						parent[i] = decoder(current)
					}
					else {
						env.whine("missing decoder", current.type)
					}
				}
				return args
			}
			encode = function(args) {
				descending_typed = get_descending_typed(args)
				while descending_typed.length > 0 {
					[parent, i] = descending_typed.pop()
					current = parent[i]
					encoder = encoders[current.type]
					if encoder {
						parent[i] = encoder(current)
					}
					else {
						env.whine("missing encoder", current.type)
					}
				}
				data = stringify(args)
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