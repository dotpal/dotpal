const Users = {}
{
	Users.link = (env) => {
		const Utils = env.require("Utils")
		Users.create = () => {
			const users = {}
			users.create = (options, read) => {
				let asset
				const user = {}
				user.cenc = () => {
					const cdata = {}
					cdata.bio = user.bio
					cdata.email = user.email
					cdata.icon = user.icon
					cdata.id = user.id
					cdata.name = user.name
					return cdata
				}
				user.adjust = (options) => {
					Utils.adjust(asset, options)
					Utils.adjust(user, options)
				}
				const id = options.id
				if (read) {
					asset = env.store.get(id)
					const options = asset
					Utils.adjust(user, options)
				}
				else {
					asset = env.store.add("user", id)
					user.adjust(options)
				}
				return user
			}
			users.get = (id) => {
				const asset = env.store.get(id)
				// if we dont write then we dont need to copy i think
				// options and asset are the same in this context
				const options = Utils.get_copy(asset)
				// dont make a new user, just read
				const read = true
				const user = users.create(options, read)
				return user
			}
			users.exists = (id) => {
				// we should have env.store.exists or something
				return env.store.get(id) != undefined
			}
			users.sdec = (sdata) => {
			}
			env.network.bounce("user", (socket, sdata) => {
				// the idea of exists is different than the idea of get
				const id = sdata.id
				if (users.exists(id)) {
					// edit request
					const user = users.get(id)
					user.adjust({
						bio: sdata.bio,
						email: sdata.email,
						icon: sdata.icon,
						name: sdata.name,
					})
					return [user.cenc()]
				}
				// user create request
				const user = users.create({
					bio: "Hello world!",
					email: sdata.email,
					icon: "https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq",
					id: id,
					name: "Noobie",
				})
				return [user.cenc()]
			})
			return users
		}
	}
}