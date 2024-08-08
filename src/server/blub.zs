Blubs = {}
{
	get_square_distance = function(a, b) {
		[ax, ay] = a
		[bx, by] = b
		dx = bx - ax
		dy = by - ay
		return dx*dx + dy*dy
	}
	link = function(env) {
		Utils = env.require("Utils")
		create = function() {
			blubs = {}
			blub_from_id = {}
			create = function(options) {
				blub = {}
				soft description = options.description or env.whine("options missing description")
				soft id = options.id or env.whine("options missing id")
				soft position = options.position or env.whine("options missing position")
				soft time = options.time or env.whine("options missing time")
				soft title = options.title or env.whine("options missing title")
				soft user = options.user or env.whine("options missing user")
				if blub_from_id[id] {
					blub = blub_from_id[id]
					blub.adjust(options)
					return blub
				}
				else {
					// env.print("create blub", id, "with options", options)
					blub_from_id[id] = blub
				}
				soft asset = env.store.get(id)
				if asset {
					description = asset.description or env.whine("asset missing description")
					id = asset.id or env.whine("asset missing id")
					position = asset.position or env.whine("asset missing position")
					time = asset.time or env.whine("asset missing time")
					title = asset.title or env.whine("asset missing title")
					user = asset.user or env.whine("asset missing user")
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
				adjust = function(options) {
					// env.print("adjust blub", id, "with options", options)
				}
				get_description = function() {
					return description
				}
				get_id = function() {
					return id
				}
				get_position = function() {
					return position
				}
				get_time = function() {
					return time
				}
				get_title = function() {
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
			env.serializer.set_encoder("blub", function(blub) {
				data = {}
				data.description = blub.get_description()
				data.id = blub.get_id()
				data.position = blub.get_position()
				data.time = blub.get_time()
				data.title = blub.get_title()
				data.user = blub.user
				data.type = "blub"
				return data
			})
			env.serializer.set_decoder("blub", function(data) {
				options = data
				blub = create(options)
				return blub
			})
			env.network.bounce("blubs_by_position", function(socket, position) {
				blubs = []
				for id in env.store.state {
					asset = env.store.get(id)
					if asset.type is "blub" and get_square_distance(position, asset.position) < 0.001 {
						blubs.push(asset)
					}
				}
				return blubs
			})
			env.network.receive("blub").tie(function(socket, blub) {
				env.network.send_but(socket, "blub", blub)
			})
			return blubs
		}
		Blubs.create = create
	}
	Blubs.link = link
}