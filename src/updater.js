const Updater = {}
{
	if (Which() === 'client') {
		const min = Math.min
		let t0 = 0.001*performance.now()
		const render = function() {
			const t = 0.001*performance.now()
			const dt = min(t - t0, 0.03)
			t0 = t
			Camera.step(dt)
			Blub.step(dt)
			requestAnimationFrame(render)
		}
		requestAnimationFrame(render)
	}
}