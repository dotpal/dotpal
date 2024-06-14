const Users = {}
{
	// link is for linking an environment, load is for loading maps or game objects or whatever.
	// but why not just do load instead of link anyways? because the semantics are bad.
	// it would be like changing multiply not to have a multiplier argument. muliplication ALWAYS has a multiplier, otherwise whats the point?
	// create is for creating objects, add for adding existing objects, remove for removing, step for stepping, etc.
	Users.link = (env) => {
		const Signal = env.require("Signal")
		const Utils = env.require("Utils")
		Users.create = (...args) => {
			const users = {}
			users.fetch = (id) => {
				const receive = Signal.create()
				env.network.fetch("asset", id).tie((cdata) => {
					const user = users.cdec(cdata)
					receive.call(user)
				})
				return receive
			}
			users.get = (id) => {
				return env.store.get(id)
			}
			users.cdec = (cdata) => {
				const options = cdata
				const local = true
				const user = users.create(cdata, local)
				return user
			}
			users.create = (options, local) => {
				const user = {}
				let read = false
				// this works for now
 				if (options.id != env.id) {
					read = true
				}
				user.senc = () => {
					const sdata = {}
					sdata.bio = user.bio
					sdata.email = user.email
					sdata.icon = user.icon
					sdata.id = user.id
					sdata.name = user.name
					return sdata
				}
				user.adjust = (options) => {
					Utils.adjust(user, options)
				}
				// does view have a fundamental meaning like multiply, step, etc.?
				// not sure, if it doesnt, maybe we need a new categorization for these types of things.
				user.view = () => {
					const container = document.createElement("div")
					document.body.appendChild(container)
					const form = document.createElement("form")
					container.appendChild(form)
					{
						const icon = document.createElement("img")
						icon.className = "icon"
						icon.src = user.icon
						form.appendChild(icon)
						icon.onclick = () => {
							user.view()
						}
					}
					const name = document.createElement("textarea")
					name.cols = 21
					name.placeholder = "name"
					name.readOnly = read
					name.rows = 1
					name.value = user.name
					form.appendChild(name)
					form.appendChild(document.createElement("br"))
					let icon
					if (!read) {
						icon = document.createElement("textarea")
						icon.cols = 26
						icon.placeholder = "icon"
						icon.rows = 1
						icon.value = user.icon
						form.appendChild(icon)
						form.appendChild(document.createElement("br"))
					}
					const bio = document.createElement("textarea")
					bio.cols = 26
					bio.placeholder = "bio"
					bio.readOnly = read
					bio.rows = 17
					bio.value = user.bio
					form.appendChild(bio)
					form.appendChild(document.createElement("br"))
					if (!read) {
						const save = document.createElement("button")
						save.textContent = "save"
						form.appendChild(save)
						form.onsubmit = () => {
							event.preventDefault()
							container.remove()
							user.adjust({
								bio: bio.value,
								icon: icon.value,
								name: name.value,
							})
							user.send()
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
				user.send = () => {
					const sdata = user.senc()
					// idk how i feel about this but whatever
					env.network.fetch("user", sdata).remove()
				}
				user.adjust(options)
				if (!local) {
					user.send()
				}
				return user
			}
			return users
		}
	}
}