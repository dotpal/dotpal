const Blubs = {}
{
	const get_square_distance = (a, b) => {
		const [ax, ay] = a
		const [bx, by] = b
		const dx = bx - ax
		const dy = by - ay
		return dx*dx + dy*dy
	}
	const link = (env) => {
		const Utils = env.require("Utils")
		const create = () => {
			const blubs = {}
			const blub_from_id = {}
			const create = (options) => {
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
				let asset = env.store.get(id)
				if (asset) {
					description = asset.description || env.error("asset missing description")
					id = asset.id || env.error("asset missing id")
					position = asset.position || env.error("asset missing position")
					time = asset.time || env.error("asset missing time")
					title = asset.title || env.error("asset missing title")
					user = asset.user || env.error("asset missing user")
				}
				else {
					asset = env.store.create(id)
					asset.description = description
					asset.id = id
					asset.position = position
					asset.time = time
					asset.title = title
					asset.user = user
					asset.type = "blub"
				}
				const adjust = (options) => {
					// env.print("adjust blub", id, "with options", options)
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
				blub.adjust = adjust
				blub.get_description = get_description
				blub.get_id = get_id
				blub.get_position = get_position
				blub.get_time = get_time
				blub.get_title = get_title
				blub.user = user
				blub.type = "blub"
				return blub
			}
			blubs.create = create
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
			env.network.bounce("blubs_by_position", (socket, position) => {
				const blubs = []
				for (const id in env.store.state) {
					const asset = env.store.get(id)
					if (asset.type == "blub" && get_square_distance(position, asset.position) < 0.001) {
						blubs.push(asset)
					}
				}
				return blubs
			})
			env.network.receive("blub").tie((socket, blub) => {
				env.network.send_but(socket, "blub", blub)
			})
			return blubs
		}
		Blubs.create = create
	}
	Blubs.link = link
}