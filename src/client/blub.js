const Blubs = {}
{
	const link = (env) => {
		const Signal = env.require("Signal")
		const create = () => {
			const blubs = {}
			const blub_from_id = {}
			const receive = Signal.create()
			const create = (options, local) => {
				// env.trace("create blub with", options)
				const blub = {}
				let description = options.description || env.error("options missing description")
				let id = options.id || env.error("options missing id")
				let position = options.position || env.error("options missing position")
				let time = options.time || env.error("options missing time")
				let title = options.title || env.error("options missing title")
				let user = options.user || env.error("options missing user")
				if (blub_from_id[id]) {
					const blub = blub_from_id[id]
					blub.adjust(options)
					return blub
				}
				else {
					// env.print("create blub", id, "with options", options)
					blub_from_id[id] = blub
				}
				const adjust = (options) => {
					// env.print("adjust blub", id, "with options", options)
				}
				const view = () => {
					env.viewer.open(blub)
				}
				const replicate = () => {
					env.network.send("blub", blub)
				}
				const get_description = () => {
					return description
				}
				const get_id = () => {
					return id
				}
				const get_position = () => {
					return position
				}
				const get_time = () => {
					return time
				}
				const get_title = () => {
					return title
				}
				if (!local) {
					replicate()
				}
				// const comment = Signal.create((comment, local) => {
				// 	if (!local) {
				// 		env.network.send("comment", comment)
				// 	}
				// })
				blub.adjust = adjust
				// blub.comment = comment
				blub.get_description = get_description
				blub.get_id = get_id
				blub.get_position = get_position
				blub.get_time = get_time
				blub.get_title = get_title
				blub.user = user
				blub.type = "blub"
				receive.call(blub)
				return blub
			}
			const easy_create = (title, description) => {
				const blub = create({
					description: description,
					id: env.get_random(),
					position: env.get_position(),
					time: env.get_time(),
					title: title,
					user: env.user,
				})
				return blub
			}
			const fetch_blubs_by_position = (position) => {
				return env.network.fetch("blubs_by_position", position)
			}
			env.serializer.set_encoder("blub", (blub) => {
				const data = {}
				data.description = blub.get_description()
				data.id = blub.get_id()
				data.position = blub.get_position()
				data.time = blub.get_time()
				data.title = blub.get_title()
				data.user = blub.user
				data.type = "blub"
				return data
			})
			env.serializer.set_decoder("blub", (data) => {
				const options = data
				const blub = create(options)
				return blub
			})
			// env.network.receive("comment").tie((socket, comment) => {
			// 	const local = true
			// 	blub.comment.call(comment, local)
			// })
			blubs.easy_create = easy_create
			blubs.fetch = fetch
			blubs.fetch_blubs_by_position = fetch_blubs_by_position
			blubs.receive = receive
			return blubs
		}
		Blubs.create = create
	}
	Blubs.link = link
}