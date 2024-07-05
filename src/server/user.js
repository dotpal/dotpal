const Users = {}
{
	const link = (env) => {
		const Utils = env.require("Utils")
		const create = () => {
			const users = {}
			const user_from_id = {}
			const create = (options) => {
				const user = {}
				let bio = options.bio || "Hello world"
				let email = options.email || env.error("options missing email")
				let icon = options.icon || "https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq"
				let id = options.id || env.error("options missing id")
				let name = options.name || "Billy Joel"
				let position = options.position || [0.970713, 5.45788891708]
				let time = options.time || env.get_time()
				if (user_from_id[id]) {
					const user = user_from_id[id]
					user.adjust(options)
					return user
				}
				else {
					env.print("create user", id, "with options", options)
					user_from_id[id] = user
				}
				let asset = env.store.get(id)
				if (asset) {
					bio = asset.bio || env.error("asset missing bio")
					email = asset.email || env.error("asset missing email")
					icon = asset.icon || env.error("asset missing icon")
					id = asset.id || env.error("asset missing id")
					name = asset.name || env.error("asset missing name")
					position = asset.position || env.error("asset missing position")
					time = asset.time || env.error("asset missing time")
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
				const adjust = (options) => {
					bio = options.bio || bio
					email = options.email || email
					icon = options.icon || icon
					name = options.name || name
					asset.bio = bio
					asset.email = email
					asset.icon = icon
					asset.name = name
				}
				const get_bio = () => {
					return bio
				}
				const get_email = () => {
					return email
				}
				const get_icon = () => {
					return icon
				}
				const get_name = () => {
					return name
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
			const exists = (user) => {
				return env.store.get(user.get_id()) != undefined
			}
			env.serializer.set_encoder("user", (user) => {
				const data = {}
				data.bio = user.get_bio()
				data.email = user.get_email()
				data.icon = user.get_icon()
				data.id = user.get_id()
				data.name = user.get_name()
				data.position = user.get_position()
				data.time = user.get_time()
				data.type = "user"
				return [data]
			})
			env.serializer.set_decoder("user", (data) => {
				const options = data
				env.print("decode", options)
				const user = create(options)
				return [user]
			})
			env.network.bounce("user", (socket, user) => {
				return [user]
			})
			env.network.receive("user").tie((socket, user) => {
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