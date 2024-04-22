const Profile = {}
{
	Profile.create = (user) => {
		const profile = {}
		const container = document.createElement('div')
		document.body.appendChild(container)
		const form = document.createElement('form')
		container.appendChild(form)
		const username = document.createElement('textarea')
		username.cols = 32
		username.placeholder = 'username'
		username.rows = 1
		form.appendChild(username)
		form.appendChild(document.createElement('br'))
		const icon = document.createElement('textarea')
		icon.cols = 32
		icon.placeholder = 'icon'
		icon.rows = 1
		form.appendChild(icon)
		form.appendChild(document.createElement('br'))
		const bio = document.createElement('textarea')
		bio.cols = 32
		bio.placeholder = 'bio'
		bio.rows = 12
		form.appendChild(bio)
		form.appendChild(document.createElement('br'))
		const save = document.createElement('button')
		save.textContent = 'save'
		form.appendChild(save)
		form.onsubmit = (event) => {
			event.preventDefault()
			container.remove()
			const options = {}
			options.bio = bio.value
			options.icon = icon.value
			options.username = username.value
			//network.send(['user', document.cookie, options])
		}
		const close = document.createElement('button')
		close.textContent = 'close'
		form.appendChild(close)
		close.onclick = (event) => {
			container.remove()
		}
		container.onclick = (event) => {
			if (event.target === container) {
				container.remove()
			}
		}
		return profile
	}
}