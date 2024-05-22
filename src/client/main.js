const Main = {}
{
	const env = {}
	{
		const loaded = {}
		env.require = (name) => {
			const _name = '_' + name
			if (!loaded[_name]) {
				eval('loaded.' + _name + ' = ' + _name)
				loaded[_name].link(env)
			}
			return loaded[_name]
		}
	}
	const Blubs = env.require('Blubs')
	const Bubbles = env.require('Bubbles')
	const Camera = env.require('Camera')
	const Chain = env.require('Chain')
	const Clock = env.require('Clock')
	const Debug = env.require('Debug')
	const Geo = env.require('Geo')
	const Hash = env.require('Hash')
	const Hooker = env.require('Hooker')
	const Login = env.require('Login')
	const Network = env.require('Network')
	const Random = env.require('Random')
	const Signal = env.require('Signal')
	const Spring = env.require('Spring')
	const Stepper = env.require('Stepper')
	const Store = env.require('Store')
	const Tryer = env.require('Tryer')
	const Users = env.require('Users')
	const Viewer = env.require('Viewer')
	const debug = Debug.create()
	env.print = debug.print
	env.error = debug.error
	const store = Store.create()
	const secret = Tryer.create(
		() => {
			const hash = store.get('secret')
			if (hash) {
				return [true, hash]
			}
			return [false]
		},
		(hash) => {
			store.set('secret', hash)
		},
		(passed) => {
			if (passed) {
				store.fetch(secret.get()).once((socket, options) => {
					const user = users.create(options, secret.get())
					const create = document.createElement('button')
					create.textContent = 'create'
					create.onclick = () => {
						Viewer.create(undefined, focused.id)
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
				const login = Login.create()
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
	const random = Random.create()
	env.get_time = Clock.get_time
	env.random = random.get
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
	env.blubs = blubs
	const style = document.createElement('style')
	style.textContent = '_include(style.css)'
	document.head.appendChild(style)
	const chain = Chain.create()
	let focused = {}
	env.focus = (blub) => {
		focused = blub
		bubbles.clear()
		loading.enable()
		blub.refresh_children()
	}
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
	blubs.create.tie((blub) => {
		loading.disable()
		bubbles.create(blub)
		camera.focus(bubbles.bubbles)
	})
	bubbles.click.tie((bubble) => {
		env.focus(bubble.blub)
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