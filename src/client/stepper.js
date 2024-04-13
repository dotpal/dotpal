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
			let t0 = 0.001*performance.now()
			const update = () => {
				const t = 0.001*performance.now()
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