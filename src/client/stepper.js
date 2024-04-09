const Stepper = {}
{
	Stepper.create = function() {
		const self = {}
		const steppers = []
		self.add = function(step) {
			steppers.push(step)
		}
		self.run = function() {
			const min = Math.min
			let t0 = 0.001*performance.now()
			const update = function() {
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