const Blubs = {}
{
	Blubs.create = (env) => {
		const blubs = {}
		const create = (options) => {
			const blub = {}
			blub.description = options.description
			blub.id = options.id
			blub.time = options.time
			blub.title = options.title
			blub.user = env.users.create(options.user)
			blub.view = () => {
				Viewer.create(blub, blubs)
			}
			blub.refresh_children = () => {
				env.bubbles.clear()
				env.network.send('get_blub_children', blub.id)
			}
			return blub
		}
		blubs.publish = (title, description, parent) => {
			const options = {}
			options.description = description
			options.position = env.geo.position.get()
			options.title = title
			env.network.send('blub', env.secret, options, parent)
		}
		const receive = Signal.create()
		blubs.receive = receive
		env.network.receive('blub').tie((socket, options) => {
			const blub = create(options)
			receive.call(blub)
		})
		blubs.fetch = (position) => {
			env.bubbles.clear()
			env.network.send('get_blubs_by_position', position)
		}
		blubs.clear = () => {
			Debug.log('clear blubs')
		}
		return blubs
	}
}