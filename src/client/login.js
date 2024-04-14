const Login = {}
{
	Login.create = () => {
		const login = {}
		login.submit = Signal.create()
		const container = document.createElement('div')
		document.body.appendChild(container)
		const form = document.createElement('form')
		container.appendChild(form)
		const email = document.createElement('textarea')
		email.placeholder = 'email'
		email.required = true
		email.rows = 1
		form.appendChild(email)
		form.appendChild(document.createElement('br'))
		const password = document.createElement('textarea')
		password.placeholder = 'password'
		password.required = true
		password.rows = 1
		form.appendChild(password)
		const start = document.createElement('button')
		form.appendChild(document.createElement('br'))
		start.textContent = 'start'
		form.appendChild(start)
		login.remove = () => {
			container.remove()
		}
		form.onsubmit = (event) => {
			event.preventDefault()
			login.submit.call([email, password])
		}
		/*
		login.open = () => {
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
			const icon_url = document.createElement('textarea')
			icon_url.cols = 32
			icon_url.placeholder = 'icon_url'
			icon_url.rows = 1
			form.appendChild(icon_url)
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
				options.icon_url = icon_url.value
				options.username = username.value
				network.send(['user', document.cookie, options])
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
		}
		*/
		return login
	}
}