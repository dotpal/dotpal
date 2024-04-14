const Saver = {}
{
	const fs = require('fs')
	Saver.create = (path) => {
		const self = {}
		// the file might not exist so we should cover that later
		const state = JSON.parse(fs.readFileSync(path, 'utf8'))
		const save = () => {
			fs.writeFileSync(path, JSON.stringify(state), 'utf8')
		}
		self.push = (...values) => {
			Debug.log('push', path, ...values)
			state.push(...values)
			save()
		}
		self.get_state = () => {
			return state
		}
		// idk if this should be done externally or not but whatever
		process.on('exit', () => {
			Debug.log('oof we closed time to save the state xd')
			save()
		})
		return self
	}
}