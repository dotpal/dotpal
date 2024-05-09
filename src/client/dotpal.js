const Dotpal = {}
{
	const env = {}
	{
		const loaded = {}
		env.require = (name) => {
			const _name = '_' + name
			if (!loaded[_name]) {
				eval('loaded.' + _name + ' = ' + _name)
				loaded[_name].load(env)
			}
			return loaded[_name]
		}
	}
	const Blubs = env.require('Blubs')
	const Bubbles = env.require('Bubbles')
	const Camera = env.require('Camera')
	const Clock = env.require('Clock')
	const Debug = env.require('Debug')
	const Geo = env.require('Geo')
	const Hooker = env.require('Hooker')
	const Network = env.require('Network')
	const Random = env.require('Random')
	const Signal = env.require('Signal')
	const Spring = env.require('Spring')
	const Stepper = env.require('Stepper')
	const Store = env.require('Store')
	const Tryer = env.require('Tryer')
	const Users = env.require('Users')
	const Viewer = env.require('Viewer')
	env.createElement = (...values) => {
		return document.createElement(...values)
	}
	env.body = document.body
	env.head = document.head
	const random = Random.create()
	env.get_time = Clock.get_time
	env.random = random.get
	const debug = Debug.create()
	env.print = debug.print
	env.error = debug.error
	const network = Network.create('localhost', 8000)
	env.network = network
	const camera = Camera.create()
	env.camera = camera
	const stepper = Stepper.create()
	const geo = Geo.create()
	env.geo = geo
	const users = Users.create()
	env.users = users
	const bubbles = Bubbles.create()
	env.bubbles = bubbles
	const blubs = Blubs.create()
	const store = Store.create()
	const style = env.createElement('style')
	style.textContent = `_include(style.css)`
	env.head.appendChild(style)
	let focused = {}
	const focus = (blub) => {
		focused = blub
		bubbles.clear()
		loading.enable()
		blub.refresh_children()
	}
	const chain = {}
	{
		const links = []
		const container = env.createElement('div')
		container.style.backgroundColor = 'rgba(0, 0, 0, 0)'
		container.style.height = 'auto'
		container.style.left = '50%'
		container.style.transform = 'translateX(-50%)'
		container.style.width = 'auto'
		env.body.appendChild(container)
		chain.push = (blub) => {
			const link = () => {
				button.remove()
			}
			const button = env.createElement('button')
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
					const create = env.createElement('button')
					create.textContent = 'create'
					create.onclick = () => {
						Viewer.create(undefined, blubs, focused.id)
					}
					env.body.appendChild(create)
					const profile = env.createElement('button')
					profile.textContent = 'profile'
					profile.onclick = () => {
						user.view()
					}
					env.body.appendChild(profile)
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
	env.secret = secret
	secret.get()
	const loading = {}
	{
		let sprite
		loading.enable = () => {
			if (!sprite) {
				sprite = env.createElement('loading')
				sprite.style.backgroundImage = 'url(_include(loading.gif))'
				sprite.style.backgroundSize = '20vh'
				env.body.appendChild(sprite)
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
	blubs.create.tie((blub) => {
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
		env.body.style.backgroundColor = '#e6e6e6'
		env.body.style.backgroundImage = 'url(_include(globe.png))'
		env.body.style.backgroundSize = '200vh'
		// env.body.style.backgroundPosition = 'center center'
		// env.body.style.backgroundPosition = -100*px/pz + 'vh' + ' ' + -100*py/pz + 'vh'
		// env.body.style.backgroundSize = 10*200/pz + 'vh'
		// env.body.style.transform = ''
	}
}