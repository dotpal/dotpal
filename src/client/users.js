const Users = {}
{
	Users.create = (network, secret) => {
		const users = {}
		users.refine = (user) => {
			user.view = () => {
				const profile = Profile.create(user)
				return profile
			}
			user.change = (options) => {
				network.send(['user', user.secret, options])
			}
		}
		users.receive_main = Signal.create()
		users.receive_other = Signal.create()
		network.receive('user').tie(([socket, user]) => {
			users.refine(user)
			if (user.secret != secret.get()) {
				users.receive_other.call(user)
			}
			else {
				users.receive_main.call(user)
			}
		})
		return users
	}
}