Utils = {}
{
	link = function(env) {
		get_copy = function(object) {
			return env.serializer.decode(env.serializer.encode(object))
		}
		adjust = function(from, to) {
			// gotta be to
			for i in to {
				from[i] = to[i] or from[i]
			}
		}
		do_options = function(object, options, defaults) {
			old defaults = defaults or {}
			for i in options {
				if options[i] isnt nil {
					object[i] = options[i]
				}
				else {
					env.whine("options missing", i)
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