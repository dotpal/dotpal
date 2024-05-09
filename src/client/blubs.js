const Blubs = {}
{
	Blubs.load = (env) => {
		const Signal = env.require('Signal')
		Blubs.create = () => {
			const blubs = {}
			const create = Signal.create((options) => {
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
			})
			blubs.create = create
			blubs.publish = (title, description, parent) => {
				const options = {}
				options.description = description
				options.position = env.geo.position.get()
				options.title = title
				env.network.send('blub', env.secret.get(), options, parent)
			}
			env.network.receive('blub').tie((socket, options) => {
				create.call(options)
			})
			blubs.fetch = (position) => {
				env.bubbles.clear()
				env.network.send('get_blubs_by_position', position)
			}
			blubs.clear = () => {
				env.print('clear blubs')
			}
			return blubs
		}
	}
}