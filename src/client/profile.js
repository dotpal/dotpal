const Profile = {}
{
	Profile.create = (network, secret) => {
		const profile = {}
		const container = document.createElement('div')
		document.body.appendChild(container)
		const form = document.createElement('form')
		container.appendChild(form)
		const name = document.createElement('textarea')
		name.cols = 32
		name.placeholder = 'name'
		name.rows = 1
		form.appendChild(name)
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
			options.name = name.value
			network.send(['user', secret.get(), options])
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