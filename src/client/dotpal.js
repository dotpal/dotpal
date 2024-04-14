const Dotpal = {}
{
	const network = Network.create('192.168.1.165', 2024, 8000)
	const stepper = Stepper.create()
	const camera = Camera.create()
	const geo = Geo.create()
	const viewer = Viewer.create()
	const bubbles = Bubbles.create(camera)
	const secret = Tryer.create(() => {
		if (document.cookie !== '') {
			return [true, document.cookie]
		}
		else {
			return [false]
		}
	})
	secret.pass(([secret, options]) => {
		network.send(['user', secret, options])
		network.receive('login').tie(([peer, options]) => {
			Debug.log('login')
			/*
			get_id = () => {
				return secret
			}
			*/
		})
	})
	// this is stupid as fuck
	const forget = () => {
		const cookies = document.cookie.split(';')
		for (let i = cookies.length; i--;) {
			const cookie = cookies[i]
			const equal = cookie.indexOf('=')
			const name = equal > -1 ? cookie.substr(0, equal) : cookie
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
		}
	}
	secret.fail(() => {
		const login = Login.create(network, camera)
		login.submit.tie(([email, password]) => {
			login.remove()
			Hash.digest(email.value + password.value).then((key) => {
				document.cookie = key
				const options = {}
				options.email = email.value
				secret.check([options])
			})
		})
	})
	viewer.open.tie((bubble) => {
		// maybe viewer and editor should be different
		if (bubble) {
			camera.focus(bubble)
			Debug.log('open bubble', bubble.get_title())
		}
	})
	viewer.close.tie((bubble) => {
		camera.focus()
	})
	viewer.submit.tie((options) => {
		viewer.close.call()
		options.position = geo.position.get()
		network.send(['post', options])
	})
	bubbles.click.tie((bubble) => {
		viewer.open.call(bubble)
	})
	geo.position.tie((position) => {
		bubbles.clear()
		network.send(['get_posts', position])
	})
	network.receive('post').tie(([peer, options]) => {
		bubbles.create(options)
	})
	{
		const create = document.createElement('button')
		create.textContent = 'create'
		create.onclick = () => {
			viewer.open.call()
		}
		document.body.appendChild(create)
		const settings = document.createElement('button')
		settings.textContent = 'settings'
		settings.onclick = () => {
			login.open()
		}
		document.body.appendChild(settings)
	}
	// idk how i feel about this yet, maybe stepper should be inserted into the singletons
	// update: i think everything will just be externally controlled from dotpal which probably makes sense because dotpal describes the behavior of dotpal
	// we just need to make sure we expose well-defined functionality for each object
	stepper.add(camera.step)
	stepper.add(bubbles.step)
	stepper.run()
	geo.position.set([0.60037755472, 2.31629626349])
	geo.request()
	{
		document.body.style.backgroundColor = '#e6e6e6'
		document.body.style.backgroundImage = 'url(_include(globe.png))'
		document.body.style.backgroundSize = '200vh'
		// document.body.style.backgroundPosition = 'center center'
		// document.body.style.backgroundPosition = -100*px/pz + 'vh' + ' ' + -100*py/pz + 'vh'
		// document.body.style.backgroundSize = 10*200/pz + 'vh'
		// document.body.style.transform = ''
	}
}