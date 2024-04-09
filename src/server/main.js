const Main = {}
{
	const network = Network.create('192.168.1.165', 2024, 8000)
	const database = StateManager.create('state.json')
	const blub_manager = BlubManager.create({network: network, database: database})
	const user_manager = UserManager.create({network: network, database: database})
	network.listen()
}