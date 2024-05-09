const Users = {}
{
	Users.load = (env) => {
		Users.create = () => {
			const users = {}
			const create = (options, secret) => {
				const user = {}
				user.bio = options.bio
				user.icon = options.icon
				user.name = options.name
				let read = true
				if (secret) {
					read = false
				}
				user.view = () => {
					const container = env.createElement('div')
					env.body.appendChild(container)
					const form = env.createElement('form')
					container.appendChild(form)
					{
						const icon = env.createElement('img')
						icon.src = user.icon
						form.appendChild(icon)
						icon.onclick = () => {
							user.view()
						}
					}
					const name = env.createElement('textarea')
					name.cols = 21
					name.placeholder = 'name'
					name.readOnly = read
					name.rows = 1
					name.value = user.name
					form.appendChild(name)
					form.appendChild(env.createElement('br'))
					let icon
					if (!read) {
						icon = env.createElement('textarea')
						icon.cols = 26
						icon.placeholder = 'icon'
						icon.rows = 1
						icon.value = user.icon
						form.appendChild(icon)
						form.appendChild(env.createElement('br'))
					}
					const bio = env.createElement('textarea')
					bio.cols = 26
					bio.placeholder = 'bio'
					bio.readOnly = read
					bio.rows = 17
					bio.value = user.bio
					form.appendChild(bio)
					form.appendChild(env.createElement('br'))
					if (!read) {
						const save = env.createElement('button')
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
					const close = env.createElement('button')
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
					env.network.send('user', secret, user)
				}
				return user
			}
			// const receive = Signal.create()
			// env.network.receive('user').tie((socket, user) => {
			// 	const user = create(options)
			// 	receive.call(user)
			// })
			users.create = create
			return users
		}
	}
}