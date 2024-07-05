const Utils = {}
{
	const link = (env) => {
		const get_copy = (object) => {
			return env.serializer.decode(env.serializer.encode(object))
		}
		const adjust = (from, to) => {
			// gotta be to
			for (const i in to) {
				from[i] = to[i] || from[i]
			}
		}
		const do_options = (object, options, defaults) => {
			defaults = defaults || {}
			for (const i in options) {
				if (options[i] != undefined) {
					object[i] = options[i]
				}
				else {
					env.error("options missing", i)
					object[i] = defaults[i]
				}
			}
		}
		Utils.get_copy = get_copy
		Utils.adjust = adjust
		Utils.do_options = do_options
	}
	Utils.link = link
}