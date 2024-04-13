const Main = {}
{
	const network = Network.create('192.168.1.165', 2024, 8000)
	const stepper = Stepper.create()
	const camera = Camera.create()
	const geo_manager = GeoManager.create()
	const viewer = PostViewer.create(camera)
	const user_manager = UserManager.create({network: network, camera: camera})
	viewer.open.subscribe((bubble) => {
		// maybe viewer and editor should be different
		if (bubble) {
			Debug.log('open bubble', bubble.get_title())
		}
	})
	viewer.submit.subscribe((options) => {
		viewer.close()
		options.position = geo_manager.position.get()
		network.send(['post', options])
	})
	geo_manager.position.subscribe((position) => {
		viewer.clear()
		network.send(['get_posts', position])
	})
	network.receive('post').subscribe(([peer, options]) => {
		viewer.create(options)
	})
	// idk how i feel about this yet, maybe stepper should be inserted into the singletons
	stepper.add(camera.step)
	stepper.add(viewer.step)
	stepper.run()
	geo_manager.position.set([0.60037755472, 2.31629626349])
	geo_manager.request()
}