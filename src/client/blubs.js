const Blubs = {}
{
	Blubs.create = (network) => {
		const blubs = {}
		blubs.receive = Signal.create()
		blubs.create = (options) => {
			const blub = {}
			blub.get_title = () => {
				return options.title
			}
			blub.get_description = () => {
				return options.description
			}
			blub.get_time = () => {
				return options.time
			}
			blub.get_children = () => {
				return options.children
			}
			blub.get_user = () => {
				return options.user
			}
			return blub
		}
		blubs.publish = (options) => {
			network.send(['blub', options])
		}
		blubs.receive = network.receive('blub')
		blubs.fetch = (position) => {
			network.send(['get_blubs', position])
		}
		blubs.clear = () => {
			Debug.log('clear blubs')
		}
		return blubs
	}
}