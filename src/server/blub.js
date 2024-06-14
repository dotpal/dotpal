const Blubs = {}
{
	const get_square_distance = (a, b) => {
		const [ax, ay] = a
		const [bx, by] = b
		const dx = bx - ax
		const dy = by - ay
		return dx*dx + dy*dy
	}
	Blubs.link = (env) => {
		const Utils = env.require("Utils")
		Blubs.create = (...args) => {
			const blubs = {}
			// dont write to external memory ever, because remove would become invalid
			// remove should remove all attributes, including title, position, description, not just send_to, send, and remove
			// but because its external, we cannot assert that those things exists, i mean we can, but
			// its not really managable for a large-scale
			// to make remove correct, we could just say that external memory is read only
			// blubs.construct = (blub, asset) => {
			// 	blub.send = () => {
			// 		const cdata = env.store.source(asset, ["user"])
			// 		env.network.send("blub", cdata)
			// 	}
			// 	blub.send_to = (socket) => {
			// 		const cdata = env.store.source(asset, ["user"])
			// 		env.network.send_to(socket, "blub", cdata)
			// 	}
			// 	blub.remove = () => {
			// 		blub.send = undefined
			// 		blub.send = undefined
			// 		blub.remove = undefined
			// 	}
			// }
			blubs.create = (options) => {
				const blub = {}
				if (!options.id) {
					blub.id = env.get_random()
					// if (!options.id) {
					// }
					// env.print(options.id)
					// if (!options.id) {
					// 	env.print(blub.id)
					// 	if (blub.id) {
					// 		Utils.adjust(blub, options)
					// 	}
					// 	else {
					// 		asset = env.store.add("blub", blub.id)
					// 		blub.adjust(options)
					// 	}
					// }
				}
				let asset = env.store.get(blub.id)
				blub.cenc = () => {
					const cdata = {}
					cdata.description = blub.description
					cdata.id = blub.id
					cdata.position = blub.position
					cdata.title = blub.title
					cdata.user = blub.user.cenc()
					return cdata
				}
				blub.senc = () => {
					const cdata = {}
					cdata.description = blub.description
					cdata.id = blub.id
					cdata.position = blub.position
					cdata.title = blub.title
					cdata.user = blub.user.id
					return cdata
				}
				blub.send_but = (socket) => {
					const cdata = blub.cenc()
					env.network.send_but(socket, "blub", cdata)
				}
				// this might be wrong because this is against the use case for send
				// send is for sending arguments to an event listener
				// not too sure if this is relevant though
				blub.send_to = (socket) => {
					const cdata = blub.cenc()
					env.network.send_to(socket, "blub", cdata)
				}
				blub.adjust = (options) => {
					Utils.adjust(blub, options)
					const sdata = blub.senc()
					Utils.adjust(asset, sdata)
				}
				// todo
				Utils.adjust(blub, options)
				return blub
			}
			// get isnt really get, its more like create new from id
			// asset and options are the same data
			blubs.get = (id) => {
				// idk if we need to copy this or not
				const asset = env.store.get(id)
				// assets are sdata
				const sdata = asset
				const blub = blubs.sdec(sdata)
				return blub
			}
			// env.network.receive("view").tie((socket, blub_id, dview) => {
			// 	const asset = env.store.get(blub_id)
			// 	asset.view += dview
			// })
			blubs.sdec = (sdata) => {
				const options = Utils.get_copy(sdata)
				options.user = env.users.get(options.user)
				const blub = blubs.create(options)
				return blub
			}
			env.network.receive("blub").tie((socket, sdata) => {
				// maybe we should have the decoder do this check instead of us or something
				if (env.users.exists(sdata.user)) {
					const blub = blubs.sdec(sdata)
					env.print(blub.send_but)
					blub.send_but(socket)
				}
				else {
					env.error("cannot create blub with invalid user key", sdata.user)
				}
			})
			const positional = env.network.receive("blubs_by_position")
			positional.tie((socket, position) => {
				// env.print("gotta send the blubs from", position)
				for (const id in env.store.assets) {
					const asset = env.store.get(id)
					if (asset.type == "blub" && get_square_distance(position, asset.position) < 0.001) {
						const blub = blubs.get(id)
						blub.send_to(socket)
					}
				}
			})
			return blubs
		}
	}
}