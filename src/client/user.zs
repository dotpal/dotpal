Users = {}
{
	link = function(env) {
		Signal = env.require("Signal")
		create = function() {
			users = {}
			user_from_id = {}
			fetch = function(user) {
				receive = Signal.create()
				env.network.fetch("user", user).once(function(user) {
					receive.call(user)
				})
				return receive
			}
			create = function(options, local) {
				user = {}
				soft bio = options.bio or env.whine("options missing bio")
				soft email = options.email or env.whine("options missing email")
				soft icon = options.icon or env.whine("options missing icon")
				soft id = options.id or env.whine("options missing id")
				soft name = options.name or env.whine("options missing name")
				soft position = options.position or env.whine("options missing position")
				soft time = options.time or env.whine("options missing time")
				if user_from_id[id] {
					user = user_from_id[id]
					user.adjust(options)
					return user
				}
				else {
					// env.print("create user", id, "with options", options)
					user_from_id[id] = user
				}
				view = function() {
					read = id isnt env.user.get_id()
					container = document.createElement("div")
					document.body.appendChild(container)
					form = document.createElement("form")
					container.appendChild(form)
					{
						icon = document.createElement("img")
						icon.className = "icon"
						icon.src = icon
						form.appendChild(icon)
						icon.onclick = function() {
							view()
						}
					}
					name = document.createElement("textarea")
					name.cols = 21
					name.placeholder = "name"
					name.readOnly = read
					name.rows = 1
					name.value = name
					form.appendChild(name)
					form.appendChild(document.createElement("br"))
					soft icon
					if not read {
						icon = document.createElement("textarea")
						icon.cols = 26
						icon.placeholder = "icon"
						icon.rows = 1
						icon.value = icon
						form.appendChild(icon)
						form.appendChild(document.createElement("br"))
					}
					bio = document.createElement("textarea")
					bio.cols = 26
					bio.placeholder = "bio"
					bio.readOnly = read
					bio.rows = 17
					bio.value = bio
					form.appendChild(bio)
					form.appendChild(document.createElement("br"))
					if not read {
						save = document.createElement("button")
						save.textContent = "save"
						form.appendChild(save)
						form.onsubmit = function() {
							event.preventDefault()
							container.remove()
							bio = bio.value
							icon = icon.value
							name = name.value
							adjust({})
						}
					}
					close = document.createElement("button")
					close.textContent = "close"
					form.appendChild(close)
					close.onclick = function() {
						container.remove()
					}
					container.onclick = function() {
						if event.target is container {
							container.remove()
						}
					}
				}
				adjust = function(options) {
					// env.print("adjust user with options", options)
					old bio = options.bio or bio
					old email = options.email or email
					old icon = options.icon or icon
					old name = options.name or name
					if not local {
						env.network.send("user", user)
					}
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
			env.serializer.set_encoder("user", function(user) {
				// env.print("user encode", user)
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
				// env.print("user decode", data)
				options = data
				user = create(options)
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