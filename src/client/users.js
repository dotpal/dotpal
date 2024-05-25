const Users = {}
{
	Users.link = (env) => {
		Users.create = () => {
			const users = {}
			const create = (options) => {
				const server = env.server
				const user = {}
				user.bio = options.bio
				user.icon = options.icon
				user.name = options.name
				let read = true
				if (env.secret.get()) {
					read = false
				}
				user.view = () => {
					const container = document.createElement('div')
					document.body.appendChild(container)
					const form = document.createElement('form')
					container.appendChild(form)
					{
						const icon = document.createElement('img')
						icon.src = user.icon
						form.appendChild(icon)
						icon.onclick = () => {
							user.view()
						}
					}
					const name = document.createElement('textarea')
					name.cols = 21
					name.placeholder = 'name'
					name.readOnly = read
					name.rows = 1
					name.value = user.name
					form.appendChild(name)
					form.appendChild(document.createElement('br'))
					let icon
					if (!read) {
						icon = document.createElement('textarea')
						icon.cols = 26
						icon.placeholder = 'icon'
						icon.rows = 1
						icon.value = user.icon
						form.appendChild(icon)
						form.appendChild(document.createElement('br'))
					}
					const bio = document.createElement('textarea')
					bio.cols = 26
					bio.placeholder = 'bio'
					bio.readOnly = read
					bio.rows = 17
					bio.value = user.bio
					form.appendChild(bio)
					form.appendChild(document.createElement('br'))
					if (!read) {
						const save = document.createElement('button')
						save.textContent = 'save'
						form.appendChild(save)
						form.onsubmit = (event) => {
							event.preventDefault()
							container.remove()
							user.bio = bio.value
							user.icon = icon.value
							user.name = name.value
							user.publish()
						}
					}
					const close = document.createElement('button')
					close.textContent = 'close'
					form.appendChild(close)
					close.onclick = (event) => {
						container.remove()
					}
					container.onclick = (event) => {
						if (event.target == container) {
							container.remove()
						}
					}
				}
				user.publish = () => {
					server.send('user', env.secret.get(), user)
				}
				return user
			}
			// const receive = Signal.create()
			// server.receive('user').tie((peer, user) => {
			// 	const user = create(options)
			// 	receive.call(user)
			// })
			users.create = create
			return users
		}
	}
}