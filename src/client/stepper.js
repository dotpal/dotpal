const Stepper = {}
{
	Stepper.create = () => {
		const self = {}
		const steppers = []
		self.add = (step) => {
			steppers.push(step)
		}
		self.run = () => {
			const min = Math.min
			let t0 = get_time()
			const update = () => {
				const t = get_time()
				const dt = min(t - t0, 0.03)
				t0 = t
				for (const i in steppers) {
					steppers[i](dt)
				}
				requestAnimationFrame(update)
			}
			requestAnimationFrame(update)
		}
		return self
	}
}