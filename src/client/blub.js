const Blubs = {}
{
	Blubs.link = (env) => {
		const Signal = env.require("Signal")
		const Utils = env.require("Utils")
		Blubs.create = (...args) => {
			const blubs = {}
			blubs.create = (options, local) => {
				const blub = {}
				blub.user = options.user
				blub.adjust = (options) => {
					Utils.adjust(blub, options)
				}
				blub.view = () => {
					env.viewer.open(blub)
				}
				blub.senc = () => {
					const sdata = {}
					// do i need id?
					sdata.description = blub.description
					sdata.id = blub.id
					sdata.position = env.geo.position.get()
					sdata.title = blub.title
					// sdata.user = blub.user.senc()
					sdata.user = blub.user.id
					return sdata
				}
				blub.send = () => {
					const sdata = blub.senc()
					env.network.send("blub", sdata)
				}
				blub.adjust(options)
				if (!local) {
					blub.send()
				}
				blubs.receive.call(blub)
				return blub
			}
			blubs.receive = Signal.create()
			blubs.easy_create = (title, description) => {
				const blub = blubs.create({
					description: description,
					time: env.get_time(),
					title: title,
					user: env.get_user(),
				})
				// this is now doing more than just create, maybe this shouldnt be easy_create
				return blub
			}
			blubs.cdec = (cdata) => {
				const options = Utils.get_copy(cdata)
				options.user = env.users.cdec(options.user)
				const local = true
				const blub = blubs.create(options, local)
				return blub
			}
			const receive = env.network.receive("blub")
			receive.tie((cdata) => {
				// options isnt really options until the user is there, so we replace the user attribute with a class object
				// this generally isnt a good practice but because options isnt being used by anything else so its fine
				// either things should be immutable or the interpreter should recognize that youre making changes to it and recommend giving it a new variable name or something idk
				// this part should probably be handled transparently by the network deserializer
				blubs.cdec(cdata)
			})
			blubs.fetch = (position) => {
				// env.bubbles.clear()
				env.network.send("blubs_by_position", position)
			}
			blubs.clear = () => {
			}
			return blubs
		}
	}
}