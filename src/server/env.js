const Env = {}
{
	const loaded = {}
	const error = console.error
	const print = console.log
	const trace = console.trace
	const assert = (value, message) => {
		if (value == undefined) {
			trace(message)
		}
	}
	const require = (name) => {
		const _name = "_" + name
		if (!loaded[_name]) {
			eval("loaded." + _name + " = " + _name)
			if (loaded[_name].link) {
				loaded[_name].link(Env)
			}
		}
		return loaded[_name]
	}
	const get_time = () => {
		return 0.001*new Date().getTime()
	}
	Env.assert = assert
	Env.error = error
	Env.get_time = get_time
	Env.print = print
	Env.require = require
	Env.trace = trace
	const Blubs = require("Blubs")
	const Network = require("Network")
	const Random = require("Random")
	const Serializer = require("Serializer")
	const Signal = require("Signal")
	const Store = require("Store")
	const Users = require("Users")
	const serializer = Serializer.create()
	Env.serializer = serializer
	const random = Random.create()
	Env.get_random = random.get
	const network = Network.create("localhost", 8000)
	Env.network = network
	const store = Store.create("store.json")
	Env.store = store
	const users = Users.create()
	Env.users = users
	const blubs = Blubs.create()
	Env.blubs = blubs
	process.on("SIGTERM", () => {
		store.save()
		network.close()
	})
}