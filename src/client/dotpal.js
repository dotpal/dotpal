const Dotpal = {}
{
	const camera = Camera.create()
	const bubbles = Bubbles.create(camera)
	const geo = Geo.create()
	const network = Network.create('localhost', 8000)
	const blubs = Blubs.create(network)
	const stepper = Stepper.create()
	const loading = {}
	{
		let sprite
		loading.enable = () => {
			if (!sprite) {
				sprite = document.createElement('loading')
				sprite.style.backgroundImage = 'url(_include(loading.gif))'
				sprite.style.backgroundSize = '20vh'
				document.body.appendChild(sprite)
			}
		}
		loading.disable = () => {
			if (sprite) {
				sprite.remove()
				sprite = undefined
			}
		}
	}
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
	})
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
	const forget = () => {
		const cookies = document.cookie.split(';')
		for (let i = cookies.length; i--;) {
			const cookie = cookies[i]
			const equal = cookie.indexOf('=')
			const name = equal > -1 ? cookie.substr(0, equal) : cookie
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
		}
	}
	const refresh_feed = (position) => {
		blubs.clear()
		bubbles.clear()
		loading.enable()
		blubs.fetch(position)
	}
	geo.position.tie(refresh_feed)
	blubs.receive.tie(([peer, options]) => {
		loading.disable()
		const blub = blubs.create(options)
		bubbles.create(blub)
	})
	bubbles.click.tie((bubble) => {
		camera.focus(bubble)
		const blub = bubble.get_blub()
		const viewer = Viewer.create(blub)
		viewer.close.tie(() => {
			camera.focus()
		})
		viewer.reply.tie(() => {
			const comment = Viewer.create()
			comment.submit.tie((options) => {
				comment.close.call()
				options.position = geo.position.get()
				blubs.publish(options)
			})
		})
		// const children = bubble.get_children()
		// for (const i in children) {
		// }
	})
	{
		const create = document.createElement('button')
		create.textContent = 'create'
		create.onclick = () => {
			const viewer = Viewer.create()
			viewer.submit.tie((options) => {
				viewer.close.call()
				options.position = geo.position.get()
				network.send(['blub', options])
			})
		}
		document.body.appendChild(create)
		const profile = document.createElement('button')
		profile.textContent = 'profile'
		profile.onclick = () => {
			const profile = Profile.create()
		}
		document.body.appendChild(profile)
	}
	// idk how i feel about this yet, maybe stepper should be inserted into the singletons
	// update: i think everything will just be externally controlled from dotpal which probably makes sense because dotpal describes the behavior of dotpal
	// we just need to make sure we expose well-defined functionality for each object
	stepper.add(camera.step)
	stepper.add(bubbles.step)
	stepper.run()
	geo.position.set([0.970713, 5.45788891708])
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