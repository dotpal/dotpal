const Users = {}
{
	const link = (env) => {
		const Signal = env.require("Signal")
		const create = () => {
			const users = {}
			const user_from_id = {}
			const fetch = (user) => {
				const receive = Signal.create()
				env.network.fetch("user", user).once((user) => {
					receive.call(user)
				})
				return receive
			}
			const create = (options, local) => {
				const user = {}
				let bio = options.bio || env.error("options missing bio")
				let email = options.email || env.error("options missing email")
				let icon = options.icon || env.error("options missing icon")
				let id = options.id || env.error("options missing id")
				let name = options.name || env.error("options missing name")
				let position = options.position || env.error("options missing position")
				let time = options.time || env.error("options missing time")
				if (user_from_id[id]) {
					const user = user_from_id[id]
					user.adjust(options)
					return user
				}
				else {
					// env.print("create user", id, "with options", options)
					user_from_id[id] = user
				}
				const view = () => {
					const read = id != env.user.get_id()
					const container = document.createElement("div")
					document.body.appendChild(container)
					const form = document.createElement("form")
					container.appendChild(form)
					{
						const icon = document.createElement("img")
						icon.className = "icon"
						icon.src = icon
						form.appendChild(icon)
						icon.onclick = () => {
							view()
						}
					}
					const name = document.createElement("textarea")
					name.cols = 21
					name.placeholder = "name"
					name.readOnly = read
					name.rows = 1
					name.value = name
					form.appendChild(name)
					form.appendChild(document.createElement("br"))
					let icon
					if (!read) {
						icon = document.createElement("textarea")
						icon.cols = 26
						icon.placeholder = "icon"
						icon.rows = 1
						icon.value = icon
						form.appendChild(icon)
						form.appendChild(document.createElement("br"))
					}
					const bio = document.createElement("textarea")
					bio.cols = 26
					bio.placeholder = "bio"
					bio.readOnly = read
					bio.rows = 17
					bio.value = bio
					form.appendChild(bio)
					form.appendChild(document.createElement("br"))
					if (!read) {
						const save = document.createElement("button")
						save.textContent = "save"
						form.appendChild(save)
						form.onsubmit = () => {
							event.preventDefault()
							container.remove()
							bio = bio.value
							icon = icon.value
							name = name.value
							adjust({})
						}
					}
					const close = document.createElement("button")
					close.textContent = "close"
					form.appendChild(close)
					close.onclick = () => {
						container.remove()
					}
					container.onclick = () => {
						if (event.target == container) {
							container.remove()
						}
					}
				}
				const adjust = (options) => {
					// env.print("adjust user with options", options)
					bio = options.bio || bio
					email = options.email || email
					icon = options.icon || icon
					name = options.name || name
					if (!local) {
						env.network.send("user", user)
					}
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
				user.view = view
				user.get_bio = get_bio
				user.get_email = get_email
				user.get_icon = get_icon
				user.get_id = get_id
				user.get_name = get_name
				user.get_position = get_position
				user.get_time = get_time
				user.type = "user"
				// this potentially invokes a replication event
				adjust({})
				return user
			}
			env.serializer.set_encoder("user", (user) => {
				// env.print("user encode", user)
				const data = {}
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
			env.serializer.set_decoder("user", (data) => {
				// env.print("user decode", data)
				const options = data
				const user = create(options)
				return user
			})
			users.create = create
			users.fetch = fetch
			return users
		}
		Users.create = create
	}
	Users.link = link
}