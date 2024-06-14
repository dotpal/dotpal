const Utils = {}
{
	Utils.link = (env) => {
		const Serial = env.require("Serial")
		Utils.get_copy = (object) => {
			return Serial.decode(Serial.encode(object))
		}
		Utils.adjust = (from, to) => {
			// gotta be to
			for (const i in to) {
				from[i] = to[i] || from[i]
			}
		}
	}
}