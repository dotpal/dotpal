const User = {}
{
	if (Which() === 'client') {
		const PI = Math.PI
		const floor = Math.floor
		const deg = PI/180
		const IP = 1/PI
		const mod = function(x, y) {
			return x - floor(x/y)*y
		}
		const get_location = function() {
			if (navigator.geolocation !== undefined) {
				navigator.geolocation.getCurrentPosition(function(position) {
					const cx = mod(position.coords.latitude*deg, PI)
					const cy = mod(position.coords.longitude*deg, 2*PI)
					const pin = document.createElement('img')
					pin.src = '_include(pin.png)'
					pin.style.left = 100*(-1 + IP*cy) + 'vh'
					pin.style.top = 100*(0.5 - IP*cx) + 'vh'
					pin.style.position = 'fixed'
					pin.style.transform = 'translate(-50%, -100%)'
					document.body.appendChild(pin)
				})
			}
			else {
				Debug.log('geolocation is not supported by this browser') // this sounds like a bad assumption
			}
		}
		get_location()
		User.open = function() {
			const container = document.createElement('container')
			document.body.appendChild(container)
			const form = document.createElement('form')
			container.appendChild(form)
			const username = document.createElement('textarea')
			username.cols = 24
			username.placeholder = 'username'
			username.rows = 1
			form.appendChild(username)
			form.appendChild(document.createElement('br'))
			const icon_url = document.createElement('textarea')
			icon_url.cols = 24
			icon_url.placeholder = 'icon_url'
			icon_url.rows = 1
			form.appendChild(icon_url)
			form.appendChild(document.createElement('br'))
			const bio = document.createElement('textarea')
			bio.cols = 24
			bio.placeholder = 'bio'
			bio.rows = 12
			form.appendChild(bio)
			form.appendChild(document.createElement('br'))
			const save = document.createElement('button')
			save.innerHTML = 'save'
			form.appendChild(save)
			form.onsubmit = function(event) {
				event.preventDefault()
				container.remove()
				const options = {}
				options.bio = bio.value
				options.icon_url = icon_url.value
				options.username = username.value
				Network.send(['edit', document.cookie, options])
			}
			const close = document.createElement('button')
			close.innerHTML = 'close'
			form.appendChild(close)
			close.onclick = function(event) {
				container.remove()
			}
			container.onclick = function(event) {
				if (event.target === container) {
					container.remove()
				}
			}
		}
		const settings = document.createElement('button')
		settings.innerHTML = 'settings'
		document.body.appendChild(settings)
		settings.onclick = function() {
			User.open()
		}
		User.secret = Tryer.create(function() {
			if (document.cookie !== '') {
				return [true, document.cookie]
			}
			else {
				return [false]
			}
		})
		User.secret.fail(function() {
			Camera.go_away()
			const container = document.createElement('container')
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
			start.innerHTML = 'start'
			form.appendChild(start)
			const close = document.createElement('button')
			close.innerHTML = 'close'
			close.onclick = function() {
				container.remove()
			}
			form.appendChild(close)
			form.onsubmit = function() {
				container.remove()
				Hash.digest(email.value + password.value).then(function(secret) {
					document.cookie = secret
					const options = {}
					options.email = email.value
					User.secret.check([options])
				})
			}
		})
		User.secret.pass(function([secret, options]) {
			Network.send(['edit', secret, options])
			Network.receive('login').subscribe(function([peer, options]) {
				Debug.log('received options', options)
				Camera.come_back()
				User.get_id = function() {
					return secret
				}
			})
		})
		// this is stupid as fuck
		User.logout = function() {
			const cookies = document.cookie.split(';')
			for (let i = 0; i < cookies.length; ++i) {
				const cookie = cookies[i]
				const equal = cookie.indexOf('=')
				const name = equal > -1 ? cookie.substr(0, equal) : cookie
				document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
			}
		}
	}
	else if (Which() === 'server') {
		const fs = require('fs')
		Network.receive('edit').subscribe(function([peer, secret, options1]) {
			if (!options1) {
				options1 = {}
			}
			let options0 = undefined
			try {
				options0 = JSON.parse(fs.readFileSync('user/' + secret, 'utf8'))
			}
			catch {
				options0 = {}
				options0.bio = ''
				options0.icon_url = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
				options0.username = String(Math.random())
			}
			// this is not good because its always writing
			options1.bio = options1.bio || options0.bio
			options1.email = options1.email || 'someone signed up without their email lmao'
			options1.icon_url = options1.icon_url || options0.icon_url
			options1.username = options1.username || options0.username
			fs.writeFileSync('user/' + secret, JSON.stringify(options1))
			Network.share(peer, ['login', options1])
		})
	}
}