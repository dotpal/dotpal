const Blubs = {}
{
	Blubs.create = (network, users) => {
		const blubs = {}
		blubs.refine = (blub) => {
			users.refine(blub.user)
			blub.view = () => {
				Debug.log('view the fucking blub')
			}
		}
		blubs.receive = Signal.create()
		blubs.publish = (options) => {
			network.send(['blub', options])
		}
		network.receive('blub').tie(([socket, blub]) => {
			blubs.refine(blub)
			blubs.receive.call(blub)
		})
		blubs.fetch = (position) => {
			network.send(['get_blubs', position])
		}
		blubs.clear = () => {
			Debug.log('clear blubs')
		}
		return blubs
	}
}