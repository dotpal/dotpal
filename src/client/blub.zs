Blubs = {}
{
	link = function(env) {
		Signal = env.require("Signal")
		create = function() {
			blubs = {}
			blub_from_id = {}
			receive = Signal.create()
			create = function(options, local) {
				// env.trace("create blub with", options)
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
				adjust = function(options) {
					// env.print("adjust blub", id, "with options", options)
				}
				view = function() {
					env.viewer.open(blub)
				}
				replicate = function() {
					env.network.send("blub", blub)
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
				if not local {
					replicate()
				}
				// comment = Signal.create(function(comment, local) {
				// 	if not local {
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
			easy_create = function(title, description) {
				blub = create({
					description: description,
					id: env.get_random(),
					position: env.get_position(),
					time: env.get_time(),
					title: title,
					user: env.user,
				})
				return blub
			}
			fetch_blubs_by_position = function(position) {
				return env.network.fetch("blubs_by_position", position)
			}
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
			// env.network.receive("comment").tie(function(socket, comment) {
			// 	local = true
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