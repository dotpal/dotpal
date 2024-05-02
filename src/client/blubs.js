const Blubs = {}
{
	Blubs.create = (network, users, secret, geo) => {
		const blubs = {}
		const create = (options) => {
			const blub = {}
			blub.description = options.description
			blub.id = options.id
			blub.time = options.time
			blub.title = options.title
			blub.user = users.create(options.user)
			blub.view = () => {
				Viewer.create(blub, blubs)
			}
			return blub
		}
		blubs.publish = (title, description, parent) => {
			const options = {}
			options.description = description
			options.position = geo.position.get()
			options.title = title
			network.send('blub', secret, options, parent)
		}
		const receive = Signal.create()
		blubs.receive = receive
		network.receive('blub').tie((socket, options) => {
			const blub = create(options)
			receive.call(blub)
		})
		blubs.fetch = (position) => {
			network.send('get_blubs_by_position', position)
		}
		blubs.clear = () => {
			Debug.log('clear blubs')
		}
		return blubs
	}
}