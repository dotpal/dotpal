const Main = {}
{
	const network = Network.create('192.168.1.165', 2024, 8000)
	const stepper = Stepper.create()
	const camera = Camera.create()
	const blub_manager = BlubManager.create({network: network, camera: camera})
	const user_manager = UserManager.create({network: network, camera: camera})
	const geo_manager = GeoManager.create([0.60037755472, 2.31629626349])
	// idk how i feel about this yet, maybe stepper should be inserted into the singletons
	stepper.add(camera.step)
	stepper.add(blub_manager.step)
	stepper.add(geo_manager.step)
	stepper.run()
}