Env = {}
{
	env = {}
	loaded = {}
	error = console.error
	print = console.log
	trace = console.trace
	assert = function(value, message) {
		if value is nil {
			trace(message)
		}
	}
	require = function(name) {
		_name = "_" + name
		if not loaded[_name] {
			eval("loaded." + _name + " = " + _name)
			if loaded[_name].link {
				loaded[_name].link(env)
			}
		}
		return loaded[_name]
	}
	get_time = function() {
		return 0.001*new Date().getTime()
	}
	env.assert = assert
	env.whine = error // wrong
	env.get_time = get_time
	env.print = print
	env.require = require
	env.trace = trace
	Blubs = require("Blubs")
	Network = require("Network")
	Random = require("Random")
	Serializer = require("Serializer")
	Signal = require("Signal")
	Store = require("Store")
	Users = require("Users")
	serializer = Serializer.create()
	env.serializer = serializer
	random = Random.create()
	env.get_random = random.get
	network = Network.create("localhost", 8000)
	env.network = network
	store = Store.create("store.json")
	env.store = store
	users = Users.create()
	env.users = users
	blubs = Blubs.create()
	env.blubs = blubs
	process.on("SIGTERM", function() {
		store.save()
		network.close()
	})
}