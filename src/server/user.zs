Users = {}
{
	link = function(env) {
		Utils = env.require("Utils")
		create = function() {
			users = {}
			user_from_id = {}
			create = function(options) {
				user = {}
				soft bio = options.bio or "Hello world"
				soft email = options.email or env.whine("options missing email")
				soft icon = options.icon or "https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq"
				soft id = options.id or env.whine("options missing id")
				soft name = options.name or "Billy Joel"
				soft position = options.position or [0.970713, 5.45788891708]
				soft time = options.time or env.get_time()
				if user_from_id[id] {
					user = user_from_id[id]
					user.adjust(options)
					return user
				}
				else {
					env.print("create user", id, "with options", options)
					user_from_id[id] = user
				}
				soft asset = env.store.get(id)
				if asset {
					old bio = asset.bio or env.whine("asset missing bio")
					old email = asset.email or env.whine("asset missing email")
					old icon = asset.icon or env.whine("asset missing icon")
					old id = asset.id or env.whine("asset missing id")
					old name = asset.name or env.whine("asset missing name")
					old position = asset.position or env.whine("asset missing position")
					old time = asset.time or env.whine("asset missing time")
				}
				else {
					asset = env.store.create(id)
					asset.bio = bio
					asset.email = email
					asset.icon = icon
					asset.id = id
					asset.name = name
					asset.position = position
					asset.time = time
					asset.type = "user"
				}
				adjust = function(options) {
					old bio = options.bio or bio
					old email = options.email or email
					old icon = options.icon or icon
					old name = options.name or name
					asset.bio = bio
					asset.email = email
					asset.icon = icon
					asset.name = name
				}
				get_bio = function() {
					return bio
				}
				get_email = function() {
					return email
				}
				get_icon = function() {
					return icon
				}
				get_name = function() {
					return name
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
				user.adjust = adjust
				user.get_bio = get_bio
				user.get_email = get_email
				user.get_icon = get_icon
				user.get_id = get_id
				user.get_name = get_name
				user.get_position = get_position
				user.get_time = get_time
				user.type = "user"
				return user
			}
			// this could be in the user object instead
			exists = function(user) {
				return env.store.get(user.get_id()) isnt nil
			}
			env.serializer.set_encoder("user", function(user) {
				data = {}
				data.bio = user.get_bio()
				data.email = user.get_email()
				data.icon = user.get_icon()
				data.id = user.get_id()
				data.name = user.get_name()
				data.position = user.get_position()
				data.time = user.get_time()
				data.type = "user"
				return data
			})
			env.serializer.set_decoder("user", function(data) {
				options = data
				env.print("decode", options)
				user = create(options)
				return user
			})
			env.network.bounce("user", function(socket, user) {
				return [user]
			})
			env.network.receive("user").tie(function(socket, user) {
				create(user)
			})
			users.create = create
			users.exists = exists
			return users
		}
		Users.create = create
	}
	Users.link = link
}