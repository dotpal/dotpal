const Blubs = {}
{
	Blubs.link = (env) => {
		const Signal = env.require('Signal')
		Blubs.create = () => {
			const blubs = {}
			const bubbles = env.bubbles
			const geo = env.geo
			const network = env.network
			const secret = env.secret
			const users = env.users
			const create = Signal.create((options) => {
				const blub = {}
				blub.description = options.description
				blub.id = options.id
				blub.time = options.time
				blub.title = options.title
				blub.user = users.create(options.user)
				blub.view = () => {
					Viewer.create(blub, blubs)
				}
				blub.refresh_children = () => {
					bubbles.clear()
					network.send('get_blub_children', blub.id)
				}
				return blub
			})
			blubs.create = create
			blubs.publish = (title, description, parent) => {
				const options = {}
				options.description = description
				options.position = geo.position.get()
				options.title = title
				network.send('blub', secret.get(), options, parent)
			}
			network.receive('blub').tie((socket, options) => {
				create.call(options)
			})
			blubs.fetch = (position) => {
				bubbles.clear()
				network.send('get_blubs_by_position', position)
			}
			blubs.clear = () => {
				print('clear blubs')
			}
			return blubs
		}
	}
}