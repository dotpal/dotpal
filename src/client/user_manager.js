const UserManager = {}
{
	UserManager.create = (options) => {
		const camera = options.camera || Debug.log('oof no camera')
		const network = options.network || Debug.log('oof no network')
		const self = {}
		self.open = () => {
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
		const settings = document.createElement('button')
		settings.textContent = 'settings'
		document.body.appendChild(settings)
		settings.onclick = () => {
			self.open()
		}
		self.secret = Tryer.create(() => {
			if (document.cookie !== '') {
				return [true, document.cookie]
			}
			else {
				return [false]
			}
		})
		self.secret.fail(() => {
			camera.go_away()
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
			const close = document.createElement('button')
			close.textContent = 'close'
			close.onclick = () => {
				container.remove()
			}
			form.appendChild(close)
			form.onsubmit = () => {
				container.remove()
				Hash.digest(email.value + password.value).then((secret) => {
					document.cookie = secret
					const options = {}
					options.email = email.value
					self.secret.check([options])
				})
			}
		})
		self.secret.pass(([secret, options]) => {
			network.send(['user', secret, options])
			network.receive('login').subscribe(([peer, options]) => {
				// Debug.log('received options', options)
				camera.come_back()
				self.get_id = () => {
					return secret
				}
			})
		})
		// this is stupid as fuck
		self.logout = () => {
			const cookies = document.cookie.split(';')
			for (let i = 0; i < cookies.length; ++i) {
				const cookie = cookies[i]
				const equal = cookie.indexOf('=')
				const name = equal > -1 ? cookie.substr(0, equal) : cookie
				document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
			}
		}
		return self
	}
}