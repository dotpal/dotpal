const Dotpal = {}
{
	const network = Network.create('localhost', 8000)
	const store = Store.create(network)
	let focused
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
					const yeah_lets_do_it = document.createElement('button')
					yeah_lets_do_it.textContent = 'yeah_lets_do_it'
					yeah_lets_do_it.onclick = () => {
						if (focused) {
							focused.blub.view()
						}
						else {
							Viewer.create(undefined, blubs)
						}
						// camera.focus([focused])
						// viewer.close.tie(() => {
						// 	camera.focus(bubbles.bubbles)
						// })
					}
					document.body.appendChild(yeah_lets_do_it)
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
	const users = Users.create(network)
	const camera = Camera.create()
	const bubbles = Bubbles.create(camera)
	const geo = Geo.create()
	const blubs = Blubs.create(network, users, secret.get(), geo)
	const stepper = Stepper.create()
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
		blubs.clear()
		bubbles.clear()
		loading.enable()
		blubs.fetch(position)
	}
	geo.position.tie(refresh)
	blubs.receive.tie((blub) => {
		loading.disable()
		bubbles.create(blub)
		camera.focus(bubbles.bubbles)
	})
	bubbles.click.tie((bubble) => {
		bubbles.clear()
		focused = bubble
		network.send('get_blub_children', bubble.blub.id)
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