const Dotpal = {}
{
	const env = {}
	const network = Network.create('localhost', 8000)
	const store = Store.create(env)
	const users = Users.create(env)
	const camera = Camera.create()
	env.camera = camera
	const bubbles = Bubbles.create(env)
	const geo = Geo.create()
	env.network = network
	env.users = users
	env.geo = geo
	env.bubbles = bubbles
	const blubs = Blubs.create(env)
	const stepper = Stepper.create()
	const chain = {}
	let focused = {}
	const focus = (blub) => {
		focused = blub
		bubbles.clear()
		loading.enable()
		blub.refresh_children()
	}
	{
		const links = []
		const container = document.createElement('div')
		container.style.backgroundColor = 'rgba(0, 0, 0, 0)'
		container.style.height = 'auto'
		container.style.left = '50%'
		container.style.transform = 'translateX(-50%)'
		container.style.width = 'auto'
		document.body.appendChild(container)
		chain.push = (blub) => {
			const link = () => {
				button.remove()
			}
			const button = document.createElement('button')
			button.textContent = blub.title
			container.appendChild(button)
			button.onclick = () => {
				for (let i = links.length; i--;) {
					if (links[i] != link) {
						links[i]()
					}
					else {
						break
					}
				}
				focus(blub)
			}
			links.push(link)
			return link
		}
		chain.push({
			title: '[local]',
			refresh_children: () => {
				blubs.fetch(geo.position.get())
			}
		})
	}
	const secret = Tryer.create(
		() => {
			const secret = store.get('secret')
			if (secret) {
				return [true, secret]
			}
			return [false]
		},
		(secret1) => {
			store.set('secret', secret1)
		},
		(passed) => {
			if (passed) {
				store.fetch(secret.get()).once((socket, options) => {
					const user = users.create(options, secret.get())
					const create = document.createElement('button')
					create.textContent = 'create'
					create.onclick = () => {
						Viewer.create(undefined, blubs, focused.id)
					}
					document.body.appendChild(create)
					const profile = document.createElement('button')
					profile.textContent = 'profile'
					profile.onclick = () => {
						user.view()
					}
					document.body.appendChild(profile)
				})
			}
			else {
				const login = Login.create(network, camera)
				login.submit.tie((email, password) => {
					login.remove()
					Hash.digest(email + password).then((hash) => {
						secret.set(hash)
						const options = {}
						options.email = email
						network.send('user', secret.get(), options)
					})
				})
			}
		}
	)
	env.secret = secret.get()
	secret.get()
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
	const refresh = (position) => {
		blubs.fetch(position)
	}
	geo.position.tie(refresh)
	blubs.receive.tie((blub) => {
		loading.disable()
		bubbles.create(blub)
		camera.focus(bubbles.bubbles)
	})
	bubbles.click.tie((bubble) => {
		focus(bubble.blub)
		chain.push(bubble.blub)
	})
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