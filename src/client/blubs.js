const Blubs = {}
{
	Blubs.link = (env) => {
		const Signal = env.require('Signal')
		Blubs.create = () => {
			const blubs = {}
			const bubbles = env.bubbles
			const geo = env.geo
			const server = env.server
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
					server.send('get_blub_children', blub.id)
				}
				return blub
			})
			blubs.create = create
			blubs.publish = (title, description, parent) => {
				const options = {}
				options.description = description
				options.position = geo.position.get()
				options.title = title
				server.send('blub', env.secret.get(), options, parent)
			}
			server.receive('blub').tie((options, b) => {
				create.call(options)
			})
			blubs.fetch = (position) => {
				bubbles.clear()
				server.send('get_blubs_by_position', position)
			}
			blubs.clear = () => {
				print('clear blubs')
			}
			return blubs
		}
	}
}