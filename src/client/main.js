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
	document.addEventListener('gesturestart', (event) => {
		event.preventDefault()
	})
	// Capitalized things are pure
	// env is shared memory
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
	const State = env.require('State')
	const Stepper = env.require('Stepper')
	const Store = env.require('Store')
	const Users = env.require('Users')
	const Viewer = env.require('Viewer')
	const debug = Debug.create()
	env.print = debug.print
	env.error = debug.error
	const store = Store.create()
	const random = Random.create()
	env.get_time = Clock.get_time
	env.random = random.get
	const network = Network.create('emelr.com', 443)
	env.network = network
	network.connect.tie((server) => {
		env.server = server
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
		const secret = State.create(
			(hash) => {
				document.cookie = hash
			},
			() => {
				return document.cookie
			}
		)
		env.secret = secret
		secret.change((hash) => {
			if (!hash) {
				let login = Login.create()
				login.submit.tie((email, password) => {
					login.remove()
					login = undefined
					Hash.digest(email + password).then((hash) => {
						const options = {}
						options.email = email
						server.send('user', hash, options)
						secret.set(hash) // this needs to be after server.send... idk how i feel
					})
				})
			}
			else {
				server.fetch('asset', hash).once((options) => {
					// env.print('get the asset!', options)
					const user = users.create(options, hash)
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
		})
		secret.check()
		const chain = Chain.create()
		let focused = {}
		env.focus = (blub) => {
			focused = blub
			bubbles.clear()
			loading.enable()
			blub.refresh_children()
		}
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
		geo.position.change(refresh)
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
	})
}
