const Main = {}
{
	const env = {}
	env.error = console.error
	env.print = console.log
	env.trace = console.trace
	{
		const loaded = {}
		env.require = (name) => {
			const _name = "_" + name
			if (!loaded[_name]) {
				eval("loaded." + _name + " = " + _name)
				if (loaded[_name].link) {
					// env.print("load with env", name)
					loaded[_name].link(env)
				}
				else {
					// env.print("load independent", name)
				}
			}
			return loaded[_name]
		}
	}
	env.get_time = () => {
		return 0.001*new Date().getTime()
	}
	const Blubs = env.require("Blubs")
	const Network = env.require("Network")
	const Random = env.require("Random")
	const Signal = env.require("Signal")
	const Store = env.require("Store")
	const Users = env.require("Users")
	const random = Random.create()
	env.get_random = random.get
	const network = Network.create("172.233.81.226", 443)
	env.network = network
	const store = Store.create("store.json")
	env.store = store
	const users = Users.create()
	env.users = users
	const blubs = Blubs.create()
	env.blubs = blubs
	// idk if this should be done externally or not but whatever
	process.on("SIGTERM", () => {
		store.save()
		network.close()
	})
}